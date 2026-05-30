import { describe, expect, it } from 'vitest';
import { DEFAULT_MODEL, formatBriefInput, launchDeskAgent } from '../agent/launchAgent';
import { launchPlanningTools } from '../agent/tools';

const brief = {
  productBrief: 'Launch an incident insights dashboard with adoption metrics and release-risk summaries.',
  audience: 'Engineering managers',
  launchDate: '2026-06-20',
  constraints: 'Security review and support enablement required.',
  availableAssets: 'Figma mockups and beta notes'
};

const requiredToolNames = [
  'extract_tasks_from_brief',
  'check_launch_readiness',
  'generate_owner_checklists',
  'draft_channel_copy'
];

const requiredHeadings = [
  '## Prioritized release plan',
  '## Risk register',
  '## Owner checklist',
  '## Launch copy suggestions',
  '## Follow-up questions'
];

describe('Launch Desk agent contract', () => {
  it('keeps the expected default model configurable by environment', () => {
    expect(DEFAULT_MODEL).toBe(process.env.OPENAI_MODEL || 'gpt-5.4-mini');
  });

  it('registers every required planning tool', () => {
    const toolNames = launchPlanningTools.map((tool) => tool.name);

    expect(toolNames).toEqual(requiredToolNames);
  });

  it('keeps agent instructions aligned with required tools and output headings', () => {
    const agent = launchDeskAgent as unknown as { instructions: string; tools: Array<{ name: string }> };

    for (const toolName of requiredToolNames) {
      expect(agent.instructions).toContain(toolName);
    }

    for (const heading of requiredHeadings) {
      expect(agent.instructions).toContain(heading);
    }

    expect(agent.tools.map((tool) => tool.name)).toEqual(requiredToolNames);
  });

  it('formats user brief fields without dropping optional context', () => {
    expect(formatBriefInput(brief)).toContain(`Product brief:\n${brief.productBrief}`);
    expect(formatBriefInput(brief)).toContain(`Audience:\n${brief.audience}`);
    expect(formatBriefInput(brief)).toContain(`Launch date:\n${brief.launchDate}`);
    expect(formatBriefInput(brief)).toContain(`Constraints:\n${brief.constraints}`);
    expect(formatBriefInput(brief)).toContain(`Available assets:\n${brief.availableAssets}`);
  });

  it('uses explicit fallbacks for empty optional brief fields', () => {
    const formatted = formatBriefInput({ ...brief, constraints: '', availableAssets: '' });

    expect(formatted).toContain('Constraints:\nNone provided');
    expect(formatted).toContain('Available assets:\nNone provided');
  });
});
