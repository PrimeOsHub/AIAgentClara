import { createHash } from 'node:crypto';
import type { LaunchBrief, StreamEvent } from '../shared/types';

type CachedPlan = {
  expiresAt: number;
  events: StreamEvent[];
};

const planCache = new Map<string, CachedPlan>();

export function cacheKeyForBrief(brief: LaunchBrief) {
  const normalized = {
    productBrief: brief.productBrief.trim().replace(/\s+/g, ' '),
    audience: brief.audience.trim().replace(/\s+/g, ' '),
    launchDate: brief.launchDate.trim(),
    constraints: brief.constraints.trim().replace(/\s+/g, ' '),
    availableAssets: brief.availableAssets.trim().replace(/\s+/g, ' ')
  };

  return createHash('sha256').update(JSON.stringify(normalized)).digest('hex');
}

export function getCachedPlan(key: string) {
  const cached = planCache.get(key);
  if (!cached) return null;
  if (cached.expiresAt <= Date.now()) {
    planCache.delete(key);
    return null;
  }
  return cached.events;
}

export function setCachedPlan(key: string, events: StreamEvent[], ttlMs: number) {
  if (ttlMs <= 0 || events.length === 0) return;
  planCache.set(key, {
    expiresAt: Date.now() + ttlMs,
    events: events.filter((event) => event.type !== 'status')
  });
}

export function clearPlanCache() {
  planCache.clear();
}
