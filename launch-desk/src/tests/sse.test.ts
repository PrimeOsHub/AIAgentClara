import { describe, expect, it } from 'vitest';
import { encodeSse, parseSseEvents } from '../shared/sse';
import type { StreamEvent } from '../shared/types';

describe('SSE helpers', () => {
  it('parses fragmented buffers and preserves the remainder', () => {
    const events: StreamEvent[] = [];
    const first = encodeSse({ type: 'status', message: 'started' });
    const second = encodeSse({ type: 'text_delta', delta: 'hello' });

    const rest = parseSseEvents(first + second.slice(0, 12), (event) => events.push(event));

    expect(events).toEqual([{ type: 'status', message: 'started' }]);
    expect(rest).toBe(second.slice(0, 12));
  });

  it('parses multi-line data events', () => {
    const events: StreamEvent[] = [];
    const rest = parseSseEvents('data: {"type":"text_delta",\ndata: "delta":"hi"}\n\n', (event) => events.push(event));

    expect(rest).toBe('');
    expect(events).toEqual([{ type: 'text_delta', delta: 'hi' }]);
  });
});
