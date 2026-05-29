import { describe, expect, it } from 'vitest';
import { checkLaunchReadiness, draftChannelCopy, extractTasks, generateOwnerChecklist } from '../agent/tools';

const brief = {
  productBrief:
    'Launch a role-based admin console for enterprise customers. Goal: reduce setup time and increase activation. Includes audit log tracking and security review.',
  audience: 'Enterprise admins and customer success teams',
  launchDate: new Date(Date.now() + 25 * 86_400_000).toISOString().slice(0, 10),
  constraints: 'Security review, sales enablement, support FAQ, and rollout flag required.',
  availableAssets: 'Figma, beta notes, demo video'
};

describe('launch planning tools', () => {
  it('extracts prioritized launch tasks from a brief', () => {
    const tasks = extractTasks(brief);
    expect(tasks.some((task) => task.priority === 'P0')).toBe(true);
    expect(tasks.map((task) => task.workstream)).toContain('Engineering');
    expect(tasks.map((task) => task.workstream)).toContain('Legal');
  });

  it('scores readiness and returns gaps or strengths', () => {
    const readiness = checkLaunchReadiness(brief);
    expect(readiness.score).toBeGreaterThan(0);
    expect(readiness.strengths.length).toBeGreaterThan(0);
  });

  it('generates owner checklist items', () => {
    const checklists = generateOwnerChecklist(brief);
    expect(checklists).toHaveLength(5);
    expect(checklists[0].checklist.length).toBeGreaterThan(2);
  });

  it('drafts channel-specific copy', () => {
    const copy = draftChannelCopy(brief);
    expect(copy.map((item) => item.channel)).toContain('Email');
    expect(copy.map((item) => item.channel)).toContain('In-app');
  });
});
