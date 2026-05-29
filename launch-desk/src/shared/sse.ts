import type { StreamEvent } from './types';

export function parseSseEvents(buffer: string, onEvent: (event: StreamEvent) => void) {
  const parts = buffer.split('\n\n');
  const rest = parts.pop() || '';

  for (const part of parts) {
    const data = part
      .split('\n')
      .filter((line) => line.startsWith('data: '))
      .map((line) => line.slice(6))
      .join('\n');

    if (!data) continue;
    onEvent(JSON.parse(data) as StreamEvent);
  }

  return rest;
}

export function encodeSse(event: StreamEvent) {
  return `data: ${JSON.stringify(event)}\n\n`;
}
