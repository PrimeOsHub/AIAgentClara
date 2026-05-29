import '../src/server/env';

const endpoint = process.env.LAUNCH_DESK_VERIFY_URL || 'http://127.0.0.1:8787/api/agent/plan';

const payload = {
  productBrief:
    'Launch a beta analytics dashboard for engineering managers. Goal: reduce weekly reporting time by 30% and improve release visibility. The feature includes dashboard widgets, summary emails, and audit-friendly export.',
  audience: 'Engineering managers and product operations leads',
  launchDate: new Date(Date.now() + 21 * 86_400_000).toISOString().slice(0, 10),
  constraints: 'Security review, analytics validation, phased rollout, and support training are required before launch.',
  availableAssets: 'Figma prototype, pilot customer notes, event tracking draft, support FAQ outline'
};

type StreamSeen = {
  tool: boolean;
  delta: boolean;
  final: boolean;
};

async function main() {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok || !response.body) {
    throw new Error(`Verification request failed: ${response.status} ${await response.text()}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const seen: StreamSeen = { tool: false, delta: false, final: false };
  let buffer = '';
  let textChars = 0;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const parts = buffer.split('\n\n');
    buffer = parts.pop() || '';

    for (const part of parts) {
      const line = part.split('\n').find((item) => item.startsWith('data: '));
      if (!line) continue;
      const event = JSON.parse(line.slice(6)) as { type: string; delta?: string; toolName?: string; message?: string };

      if (event.type === 'tool_progress') {
        seen.tool = true;
        console.log(`tool_progress: ${event.toolName}`);
      }
      if (event.type === 'text_delta') {
        seen.delta = true;
        textChars += event.delta?.length || 0;
      }
      if (event.type === 'final') seen.final = true;
      if (event.type === 'error') throw new Error(event.message || 'Agent stream emitted an error');

      if (seen.tool && seen.delta && textChars >= 20) {
        console.log(`stream verification passed early: tool event + ${textChars} text chars`);
        await reader.cancel();
        return;
      }
    }
  }

  if (!seen.tool || !seen.delta) {
    throw new Error(`Stream verification failed. Seen=${JSON.stringify(seen)}, textChars=${textChars}`);
  }

  console.log(`stream verification passed: tool=${seen.tool}, delta=${seen.delta}, final=${seen.final}, textChars=${textChars}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
