import { describe, expect, it, beforeEach } from 'vitest';
import { cacheKeyForBrief, clearPlanCache, getCachedPlan, setCachedPlan } from '../server/cache';
import { publicAgentError } from '../server/errors';

const brief = {
  productBrief: 'Launch a team dashboard with adoption goals and support workflows.',
  audience: 'Engineering leaders',
  launchDate: '2026-06-19',
  constraints: 'Security review required',
  availableAssets: 'Demo video'
};

describe('server utility behavior', () => {
  beforeEach(() => clearPlanCache());

  it('normalizes cache keys for whitespace-only brief differences', () => {
    const keyA = cacheKeyForBrief(brief);
    const keyB = cacheKeyForBrief({ ...brief, productBrief: `  ${brief.productBrief.replaceAll(' ', '   ')}  ` });

    expect(keyA).toBe(keyB);
  });

  it('replays cached stream events until ttl expires', () => {
    const key = cacheKeyForBrief(brief);
    setCachedPlan(key, [{ type: 'text_delta', delta: 'cached' }, { type: 'final', text: 'cached' }], 1000);

    expect(getCachedPlan(key)).toEqual([{ type: 'text_delta', delta: 'cached' }, { type: 'final', text: 'cached' }]);
  });

  it('maps rate-limit errors to retryable public messages', () => {
    const error = Object.assign(new Error('rate limit exceeded'), { status: 429 });

    expect(publicAgentError(error)).toMatchObject({
      code: 'openai_rate_limited',
      retryable: true
    });
  });
});
