import { Agent, Runner, getGlobalTraceProvider } from '@openai/agents';
import type { LaunchBrief, StreamEvent } from '../shared/types';
import { launchPlanningTools } from './tools';

export const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-5.4-mini';

export const launchDeskAgent = new Agent({
  name: 'Launch Desk',
  model: DEFAULT_MODEL,
  instructions: `
You are Launch Desk, a release planning agent for engineering teams.

Turn rough launch ideas into actionable release plans. Always use the provided planning tools before composing the final answer:
1. extract_tasks_from_brief
2. check_launch_readiness
3. generate_owner_checklists
4. draft_channel_copy

Your final response must be structured with these sections:
- Prioritized release plan
- Risk register
- Owner checklist
- Launch copy suggestions
- Follow-up questions

Be concrete and decision-oriented. If key details are missing, still provide a useful provisional plan and ask focused follow-up questions. Avoid pretending that dates, owners, metrics, or legal approvals are known if the user did not provide them.
`,
  tools: launchPlanningTools
});

export function formatBriefInput(brief: LaunchBrief): string {
  return `
Product brief:
${brief.productBrief}

Audience:
${brief.audience}

Launch date:
${brief.launchDate}

Constraints:
${brief.constraints || 'None provided'}

Available assets:
${brief.availableAssets || 'None provided'}
`;
}

function toolNameFromEvent(event: unknown): string | null {
  const item = (event as { item?: { type?: string; name?: string; rawItem?: { name?: string } } }).item;
  if (!item) return null;
  if (item.type && /tool/i.test(item.type)) {
    return item.name || item.rawItem?.name || item.type;
  }
  return null;
}

function textDeltaFromEvent(event: unknown): string | null {
  const raw = event as {
    type?: string;
    data?: {
      type?: string;
      delta?: string;
      event?: {
        type?: string;
        delta?: string;
      };
    };
  };

  if (raw.type !== 'raw_model_stream_event') return null;
  if (raw.data?.type === 'output_text_delta' && raw.data.delta) return raw.data.delta;
  if (raw.data?.event?.type === 'response.output_text.delta' && raw.data.event.delta) {
    return raw.data.event.delta;
  }
  return null;
}

export async function* runLaunchDeskStream(brief: LaunchBrief): AsyncGenerator<StreamEvent> {
  yield { type: 'status', message: 'Preparing launch context' };

  let finalText = '';
  const seenToolStarts = new Set<string>();
  const seenToolCompletions = new Set<string>();

  const runner = new Runner({
    workflowName: 'Launch Desk release planning',
    traceIncludeSensitiveData: false
  });

  try {
    const stream = await runner.run(launchDeskAgent, formatBriefInput(brief), { stream: true });

    for await (const event of stream) {
      const toolName = toolNameFromEvent(event);
      const eventType = (event as { type?: string }).type;
      const itemType = (event as { item?: { type?: string } }).item?.type || '';

      if (toolName && eventType === 'run_item_stream_event' && /call/i.test(itemType) && !seenToolStarts.has(toolName)) {
        seenToolStarts.add(toolName);
        yield { type: 'tool_progress', toolName, phase: 'started', summary: 'Tool call started' };
      }

      if (toolName && eventType === 'run_item_stream_event' && /output|result/i.test(itemType) && !seenToolCompletions.has(toolName)) {
        seenToolCompletions.add(toolName);
        yield { type: 'tool_progress', toolName, phase: 'completed', summary: 'Tool output received' };
      }

      const delta = textDeltaFromEvent(event);
      if (delta) {
        finalText += delta;
        yield { type: 'text_delta', delta };
      }
    }

    if ('finalOutput' in stream && typeof stream.finalOutput === 'string' && !finalText.trim()) {
      finalText = stream.finalOutput;
      yield { type: 'text_delta', delta: stream.finalOutput };
    }

    yield { type: 'final', text: finalText.trim() };
  } finally {
    await getGlobalTraceProvider().forceFlush();
  }
}

export async function runLaunchDeskOnce(brief: LaunchBrief) {
  const runner = new Runner({
    workflowName: 'Launch Desk release planning',
    traceIncludeSensitiveData: false
  });
  return runner.run(launchDeskAgent, formatBriefInput(brief));
}
