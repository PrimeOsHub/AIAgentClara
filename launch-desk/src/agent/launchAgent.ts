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

Your final response must use this exact Markdown skeleton and keep every heading unchanged:

## Prioritized release plan

## Risk register

## Owner checklist

## Launch copy suggestions

## Follow-up questions

Keep the response concise enough for a release team to scan quickly: roughly 700-1,100 words unless the brief is unusually complex.

Be concrete and decision-oriented. If key details are missing, still provide a useful provisional plan and ask focused follow-up questions. Avoid pretending that dates, owners, metrics, or legal approvals are known if the user did not provide them.
`,
  modelSettings: {
    parallelToolCalls: true,
    maxTokens: 2500,
    reasoning: { effort: 'low' },
    text: { verbosity: 'medium' }
  },
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
  const item = (event as { item?: { type?: string; name?: string; rawItem?: { name?: string }; output?: unknown } }).item;
  if (!item) return null;
  if (!item.type || !/tool/i.test(item.type)) return null;
  return item.name || item.rawItem?.name || item.type;
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

function rawToolProgressFromEvent(event: unknown): { toolName: string; phase: 'started' | 'completed' } | null {
  const raw = event as {
    type?: string;
    data?: {
      event?: {
        type?: string;
        item?: {
          type?: string;
          name?: string;
        };
      };
    };
  };

  if (raw.type !== 'raw_model_stream_event') return null;
  const modelEvent = raw.data?.event;
  if (modelEvent?.item?.type !== 'function_call' || !modelEvent.item.name) return null;

  if (modelEvent.type === 'response.output_item.added') {
    return { toolName: modelEvent.item.name, phase: 'started' };
  }

  if (modelEvent.type === 'response.output_item.done') {
    return { toolName: modelEvent.item.name, phase: 'completed' };
  }

  return null;
}

export async function* runLaunchDeskStream(brief: LaunchBrief, options: { signal?: AbortSignal } = {}): AsyncGenerator<StreamEvent> {
  yield { type: 'status', message: 'Preparing launch context' };

  let finalText = '';
  const seenToolStarts = new Set<string>();
  const seenToolCompletions = new Set<string>();

  const runner = new Runner({
    workflowName: 'Launch Desk release planning',
    traceIncludeSensitiveData: false
  });

  try {
    const stream = await runner.run(launchDeskAgent, formatBriefInput(brief), {
      stream: true,
      signal: options.signal,
      maxTurns: 8
    });

    for await (const event of stream) {
      const rawToolProgress = rawToolProgressFromEvent(event);
      if (rawToolProgress?.phase === 'started' && !seenToolStarts.has(rawToolProgress.toolName)) {
        seenToolStarts.add(rawToolProgress.toolName);
        yield {
          type: 'tool_progress',
          toolName: rawToolProgress.toolName,
          phase: 'started',
          summary: 'Tool call started'
        };
      }

      if (rawToolProgress?.phase === 'completed' && !seenToolCompletions.has(rawToolProgress.toolName)) {
        seenToolCompletions.add(rawToolProgress.toolName);
        yield {
          type: 'tool_progress',
          toolName: rawToolProgress.toolName,
          phase: 'completed',
          summary: 'Tool call completed'
        };
      }

      const toolName = toolNameFromEvent(event);
      const eventType = (event as { type?: string }).type;
      const eventName = (event as { name?: string }).name || '';

      if (toolName && eventType === 'run_item_stream_event' && eventName === 'tool_called' && !seenToolStarts.has(toolName)) {
        seenToolStarts.add(toolName);
        yield { type: 'tool_progress', toolName, phase: 'started', summary: 'Tool call started' };
      }

      if (toolName && eventType === 'run_item_stream_event' && eventName === 'tool_output' && !seenToolCompletions.has(toolName)) {
        seenToolCompletions.add(toolName);
        yield { type: 'tool_progress', toolName, phase: 'completed', summary: 'Tool output received' };
      }

      const delta = textDeltaFromEvent(event);
      if (delta) {
        finalText += delta;
        yield { type: 'text_delta', delta };
      }
    }

    await stream.completed;

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
