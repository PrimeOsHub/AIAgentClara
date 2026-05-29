import { z } from 'zod';

export const launchBriefSchema = z.object({
  productBrief: z.string().min(20, 'Describe the launch idea in at least 20 characters.'),
  audience: z.string().min(2, 'Audience is required.'),
  launchDate: z.string().min(1, 'Launch date is required.'),
  constraints: z.string().default(''),
  availableAssets: z.string().default('')
});

export type LaunchBrief = z.infer<typeof launchBriefSchema>;

export type StreamEvent =
  | { type: 'status'; message: string }
  | { type: 'tool_progress'; toolName: string; phase: 'started' | 'completed'; summary?: string }
  | { type: 'text_delta'; delta: string }
  | { type: 'final'; text: string }
  | { type: 'error'; message: string; code?: string; retryable?: boolean };

export type ReadinessScore = {
  score: number;
  label: 'blocked' | 'at-risk' | 'ready-with-watchouts' | 'ready';
  gaps: string[];
  strengths: string[];
};

export type ExtractedTask = {
  title: string;
  priority: 'P0' | 'P1' | 'P2';
  workstream: 'Product' | 'Engineering' | 'QA' | 'Data' | 'Support' | 'Marketing' | 'Legal' | 'Sales';
  rationale: string;
};

export type OwnerChecklistItem = {
  owner: string;
  due: string;
  checklist: string[];
};

export type ChannelCopy = {
  channel: 'Email' | 'In-app' | 'Blog' | 'Sales enablement' | 'Social';
  draft: string;
};
