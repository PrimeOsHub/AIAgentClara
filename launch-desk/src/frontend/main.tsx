import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AlertTriangle, CalendarDays, CheckCircle2, ClipboardList, Loader2, Megaphone, Rocket, Send, ShieldCheck, Sparkles } from 'lucide-react';
import type { LaunchBrief, StreamEvent } from '../shared/types';
import './styles.css';

const sampleBrief: LaunchBrief = {
  productBrief:
    'Launch an AI-powered workspace summary feature that turns weekly engineering activity into an executive-ready release digest. Goal: improve leadership visibility and reduce status meeting prep time.',
  audience: 'Engineering managers, product leads, and executive stakeholders',
  launchDate: new Date(Date.now() + 21 * 86_400_000).toISOString().slice(0, 10),
  constraints:
    'Needs security review, opt-in beta flag, support enablement, rollback plan, and dashboard events before public launch.',
  availableAssets: 'Figma mockups, beta feedback notes, demo recording, analytics dashboard draft, product FAQ outline'
};

function parseSseChunk(buffer: string, onEvent: (event: StreamEvent) => void) {
  const parts = buffer.split('\n\n');
  const rest = parts.pop() || '';
  for (const part of parts) {
    const line = part
      .split('\n')
      .find((item) => item.startsWith('data: '));
    if (!line) continue;
    onEvent(JSON.parse(line.slice(6)) as StreamEvent);
  }
  return rest;
}

function App() {
  const [brief, setBrief] = useState<LaunchBrief>(sampleBrief);
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [answer, setAnswer] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState('');

  const toolEvents = useMemo(() => events.filter((event) => event.type === 'tool_progress'), [events]);
  const status = useMemo(() => [...events].reverse().find((event) => event.type === 'status'), [events]);

  function update<K extends keyof LaunchBrief>(key: K, value: LaunchBrief[K]) {
    setBrief((current) => ({ ...current, [key]: value }));
  }

  async function submitPlan(event: React.FormEvent) {
    event.preventDefault();
    setIsRunning(true);
    setError('');
    setEvents([]);
    setAnswer('');

    try {
      const response = await fetch('/api/agent/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brief)
      });

      if (!response.ok || !response.body) {
        throw new Error(await response.text());
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        buffer = parseSseChunk(buffer, (streamEvent) => {
          setEvents((current) => [...current, streamEvent]);
          if (streamEvent.type === 'text_delta') {
            setAnswer((current) => current + streamEvent.delta);
          }
          if (streamEvent.type === 'error') {
            setError(streamEvent.message);
          }
        });
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unexpected error');
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <main className="app-shell">
      <section className="workspace">
        <aside className="left-panel">
          <div className="brand-row">
            <div className="brand-mark">
              <Rocket size={22} />
            </div>
            <div>
              <p className="eyebrow">Agent workspace</p>
              <h1>Launch Desk</h1>
            </div>
          </div>

          <form className="brief-form" onSubmit={submitPlan}>
            <label>
              <span>Product brief</span>
              <textarea
                value={brief.productBrief}
                onChange={(event) => update('productBrief', event.target.value)}
                rows={7}
              />
            </label>

            <div className="field-grid">
              <label>
                <span>Audience</span>
                <input value={brief.audience} onChange={(event) => update('audience', event.target.value)} />
              </label>
              <label>
                <span>Launch date</span>
                <input type="date" value={brief.launchDate} onChange={(event) => update('launchDate', event.target.value)} />
              </label>
            </div>

            <label>
              <span>Constraints</span>
              <textarea
                value={brief.constraints}
                onChange={(event) => update('constraints', event.target.value)}
                rows={4}
              />
            </label>

            <label>
              <span>Available assets</span>
              <textarea
                value={brief.availableAssets}
                onChange={(event) => update('availableAssets', event.target.value)}
                rows={4}
              />
            </label>

            <button className="primary-action" type="submit" disabled={isRunning}>
              {isRunning ? <Loader2 className="spin" size={18} /> : <Send size={18} />}
              Generate release plan
            </button>
          </form>
        </aside>

        <section className="agent-panel">
          <div className="top-strip">
            <div>
              <p className="eyebrow">Progressive agent stream</p>
              <h2>{isRunning ? 'Planning in progress' : 'Release plan output'}</h2>
            </div>
            <div className={`live-pill ${isRunning ? 'active' : ''}`}>
              <span />
              {isRunning ? 'Streaming' : 'Idle'}
            </div>
          </div>

          <div className="signal-grid">
            <div className="signal">
              <ClipboardList size={18} />
              <strong>{toolEvents.length}</strong>
              <span>tool events</span>
            </div>
            <div className="signal">
              <CalendarDays size={18} />
              <strong>{brief.launchDate || 'TBD'}</strong>
              <span>launch date</span>
            </div>
            <div className="signal">
              <ShieldCheck size={18} />
              <strong>Tracing</strong>
              <span>enabled server-side</span>
            </div>
          </div>

          {status?.type === 'status' && (
            <div className="status-line">
              <Sparkles size={16} />
              {status.message}
            </div>
          )}

          {error && (
            <div className="error-line">
              <AlertTriangle size={16} />
              {error}
            </div>
          )}

          <div className="tool-timeline">
            {toolEvents.map((event, index) =>
              event.type === 'tool_progress' ? (
                <div className="tool-chip" key={`${event.toolName}-${event.phase}-${index}`}>
                  <CheckCircle2 size={15} />
                  <span>{event.toolName}</span>
                  <em>{event.phase}</em>
                </div>
              ) : null
            )}
          </div>

          <article className="output-surface">
            {answer ? (
              <pre>{answer}</pre>
            ) : (
              <div className="empty-state">
                <Megaphone size={34} />
                <p>Enter the launch context and run the agent to stream a prioritized plan, risks, owner checklists, copy, and follow-up questions.</p>
              </div>
            )}
          </article>
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
