import cors from 'cors';
import express from 'express';
import { runLaunchDeskStream } from '../agent/launchAgent';
import { encodeSse } from '../shared/sse';
import { launchBriefSchema, type StreamEvent } from '../shared/types';
import { cacheKeyForBrief, getCachedPlan, setCachedPlan } from './cache';
import { env } from './env';
import { isAbortLike, publicAgentError } from './errors';

const app = express();

app.use(cors({ origin: env.clientOrigin }));
app.use(express.json({ limit: '1mb' }));

function writeSse(res: express.Response, event: StreamEvent) {
  res.write(encodeSse(event));
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    app: 'Launch Desk',
    model: env.model,
    hasOpenAIKey: env.hasOpenAIKey,
    streaming: 'sse'
  });
});

app.post('/api/agent/plan', async (req, res) => {
  const parsed = launchBriefSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid launch brief', details: parsed.error.flatten() });
    return;
  }

  if (!env.hasOpenAIKey) {
    res.status(500).json({ error: 'OPENAI_API_KEY is not configured for the server process.' });
    return;
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no'
  });

  writeSse(res, { type: 'status', message: 'Launch Desk agent started' });

  const cacheKey = cacheKeyForBrief(parsed.data);
  const cachedEvents = getCachedPlan(cacheKey);
  if (cachedEvents) {
    writeSse(res, { type: 'status', message: 'Replaying cached launch plan' });
    for (const event of cachedEvents) writeSse(res, event);
    res.end();
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), env.requestTimeoutMs);
  res.on('close', () => {
    if (!res.writableEnded) controller.abort();
  });

  const streamedEvents: StreamEvent[] = [];

  try {
    for await (const event of runLaunchDeskStream(parsed.data, { signal: controller.signal })) {
      streamedEvents.push(event);
      writeSse(res, event);
    }
    setCachedPlan(cacheKey, streamedEvents, env.cacheTtlMs);
  } catch (error) {
    if (!isAbortLike(error) || !res.writableEnded) {
      const publicError = publicAgentError(error);
      writeSse(res, { type: 'error', ...publicError });
    }
  } finally {
    clearTimeout(timeout);
    res.end();
  }
});

app.listen(env.port, '127.0.0.1', () => {
  console.log(`Launch Desk API listening on http://127.0.0.1:${env.port}`);
  console.log(`Model: ${env.model}`);
  console.log(`OPENAI_API_KEY configured: ${env.hasOpenAIKey}`);
});
