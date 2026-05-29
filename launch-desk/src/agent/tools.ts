import { tool } from '@openai/agents';
import { z } from 'zod';
import type { ChannelCopy, ExtractedTask, OwnerChecklistItem, ReadinessScore } from '../shared/types';

const briefParams = z.object({
  productBrief: z.string().describe('The rough product launch idea or product brief.'),
  audience: z.string().describe('The intended launch audience.'),
  launchDate: z.string().describe('Target launch date.'),
  constraints: z.string().describe('Constraints, dependencies, risks, and must-haves.'),
  availableAssets: z.string().describe('Known launch assets such as docs, demos, designs, metrics, or screenshots.')
});

function splitSignals(input: string): string[] {
  return input
    .split(/[\n.;]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function daysUntil(dateText: string): number | null {
  const target = new Date(dateText);
  if (Number.isNaN(target.getTime())) return null;
  const today = new Date();
  const ms = target.getTime() - today.getTime();
  return Math.ceil(ms / 86_400_000);
}

export function extractTasks(input: z.infer<typeof briefParams>): ExtractedTask[] {
  const briefSignals = splitSignals(input.productBrief);
  const hasMetrics = /metric|kpi|goal|conversion|retention|revenue|activation|adoption/i.test(input.productBrief);
  const hasAssets = input.availableAssets.trim().length > 0;
  const tightWindow = (daysUntil(input.launchDate) ?? 30) <= 14;

  const tasks: ExtractedTask[] = [
    {
      title: 'Lock launch scope and success metrics',
      priority: 'P0',
      workstream: 'Product',
      rationale: hasMetrics
        ? 'The brief includes measurable intent; turn it into launch gates and dashboard targets.'
        : 'The plan needs explicit success metrics before engineering and GTM teams can prioritize.'
    },
    {
      title: 'Build release readiness checklist and rollback path',
      priority: 'P0',
      workstream: 'Engineering',
      rationale: 'Every launch needs ownership for deployment, monitoring, rollback, and incident response.'
    },
    {
      title: 'Create QA pass for audience-critical flows',
      priority: 'P0',
      workstream: 'QA',
      rationale: `The audience is ${input.audience}; launch quality should focus on their highest-value path.`
    },
    {
      title: 'Prepare internal enablement notes',
      priority: tightWindow ? 'P0' : 'P1',
      workstream: 'Support',
      rationale: tightWindow
        ? 'The launch window is tight, so support readiness should happen immediately.'
        : 'Support and customer-facing teams need a concise explanation, known issues, and escalation path.'
    },
    {
      title: 'Draft external announcement copy',
      priority: hasAssets ? 'P1' : 'P2',
      workstream: 'Marketing',
      rationale: hasAssets
        ? 'Existing assets can be converted into launch copy quickly.'
        : 'Copy can start once screenshots, demo notes, or proof points are available.'
    }
  ];

  for (const signal of briefSignals.slice(0, 3)) {
    if (/data|analytics|dashboard|event|tracking/i.test(signal)) {
      tasks.push({
        title: 'Validate analytics and event tracking',
        priority: 'P1',
        workstream: 'Data',
        rationale: `The brief mentions "${signal}", which needs measurable instrumentation.`
      });
    }
    if (/legal|privacy|security|compliance|terms/i.test(signal)) {
      tasks.push({
        title: 'Complete legal, privacy, or security review',
        priority: 'P0',
        workstream: 'Legal',
        rationale: `The brief mentions "${signal}", which should be cleared before public launch.`
      });
    }
  }

  return tasks;
}

export function checkLaunchReadiness(input: z.infer<typeof briefParams>): ReadinessScore {
  const gaps: string[] = [];
  const strengths: string[] = [];

  if (input.productBrief.length < 80) gaps.push('Product brief is too thin to infer full scope.');
  else strengths.push('Product brief has enough detail to extract workstreams.');

  if (!/metric|kpi|goal|conversion|retention|revenue|activation|adoption/i.test(input.productBrief)) {
    gaps.push('Success metric or launch goal is missing.');
  } else {
    strengths.push('Brief includes a measurable outcome signal.');
  }

  if (!input.availableAssets.trim()) gaps.push('No launch assets were listed.');
  else strengths.push('Existing assets can accelerate GTM preparation.');

  if (/dependency|blocked|risk|legal|security|privacy|migration|sales|support/i.test(input.constraints)) {
    gaps.push('Constraints include dependencies that need explicit owners.');
  } else if (input.constraints.trim()) {
    strengths.push('Constraints are documented.');
  } else {
    gaps.push('Constraints are not documented.');
  }

  const days = daysUntil(input.launchDate);
  if (days === null) gaps.push('Launch date could not be parsed.');
  else if (days < 0) gaps.push('Launch date is in the past.');
  else if (days <= 14) gaps.push('Launch window is tight; reduce scope or increase owner clarity.');
  else strengths.push('Launch window has enough time for readiness work.');

  const score = Math.max(15, Math.min(95, 100 - gaps.length * 15 + strengths.length * 5));
  const label: ReadinessScore['label'] =
    score < 45 ? 'blocked' : score < 65 ? 'at-risk' : score < 85 ? 'ready-with-watchouts' : 'ready';

  return { score, label, gaps, strengths };
}

export function generateOwnerChecklist(input: z.infer<typeof briefParams>): OwnerChecklistItem[] {
  const launchDate = input.launchDate || 'launch day';
  return [
    {
      owner: 'Product lead',
      due: `Before ${launchDate}`,
      checklist: ['Confirm scope', 'Define success metric', 'Approve launch narrative', 'Resolve open questions']
    },
    {
      owner: 'Engineering lead',
      due: `T-5 business days from ${launchDate}`,
      checklist: ['Confirm code freeze', 'Verify rollback path', 'Prepare monitoring', 'Assign launch-day responder']
    },
    {
      owner: 'QA lead',
      due: `T-3 business days from ${launchDate}`,
      checklist: ['Run critical-path tests', 'Verify target audience scenarios', 'Log known issues', 'Confirm release signoff']
    },
    {
      owner: 'GTM / Marketing',
      due: `T-2 business days from ${launchDate}`,
      checklist: ['Finalize copy', 'Select channels', 'Attach assets', 'Schedule announcement']
    },
    {
      owner: 'Support / Success',
      due: `T-1 business day from ${launchDate}`,
      checklist: ['Prepare FAQ', 'Confirm escalation path', 'Brief customer-facing teams', 'Document common objections']
    }
  ];
}

export function draftChannelCopy(input: z.infer<typeof briefParams>): ChannelCopy[] {
  const oneLine = input.productBrief.split(/[.\n]/)[0]?.trim() || 'A new product update is launching';
  const audience = input.audience || 'customers';
  return [
    {
      channel: 'Email',
      draft: `Subject: New for ${audience}: ${oneLine}\n\nWe are launching an update designed for ${audience}. It helps teams move faster with clearer workflows and fewer manual steps. More details are coming on ${input.launchDate}.`
    },
    {
      channel: 'In-app',
      draft: `New: ${oneLine}. Built for ${audience}. Open the release notes to see what changed and what to try first.`
    },
    {
      channel: 'Blog',
      draft: `Today we are introducing ${oneLine}. This launch focuses on ${audience}, the problem they face, and the measurable improvements they can expect after rollout.`
    },
    {
      channel: 'Sales enablement',
      draft: `Positioning: ${oneLine}. Best-fit audience: ${audience}. Lead with the workflow pain, show the launch asset, and close with the success metric.`
    },
    {
      channel: 'Social',
      draft: `Launching ${input.launchDate}: ${oneLine}. Built for ${audience}.`
    }
  ];
}

export const launchPlanningTools = [
  tool({
    name: 'extract_tasks_from_brief',
    description: 'Extract prioritized launch tasks and workstreams from the product brief.',
    parameters: briefParams,
    async execute(input) {
      return extractTasks(input);
    }
  }),
  tool({
    name: 'check_launch_readiness',
    description: 'Check launch readiness against a rubric and identify gaps or strengths.',
    parameters: briefParams,
    async execute(input) {
      return checkLaunchReadiness(input);
    }
  }),
  tool({
    name: 'generate_owner_checklists',
    description: 'Generate owner-specific checklist items for the release plan.',
    parameters: briefParams,
    async execute(input) {
      return generateOwnerChecklist(input);
    }
  }),
  tool({
    name: 'draft_channel_copy',
    description: 'Draft launch copy for email, in-app, blog, sales enablement, and social channels.',
    parameters: briefParams,
    async execute(input) {
      return draftChannelCopy(input);
    }
  })
];
