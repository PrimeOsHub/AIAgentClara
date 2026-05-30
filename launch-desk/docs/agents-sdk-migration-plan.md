# Launch Desk Agents SDK Migration Plan

Date: 2026-05-30

## Decision

Launch Desk should remain on the OpenAI Agents SDK. The active app is already implemented with `@openai/agents`; no direct Responses API runtime path was found in `src/`, `scripts/`, `README.md`, or `package.json`.

The migration is therefore not a replacement project. Treat it as a validation and hardening project: preserve the current user experience, keep the normalized SSE contract stable, and add tests and documentation around the existing Agents SDK architecture.

## Current Architecture

- Frontend: React form in `src/frontend/main.tsx` posts launch context to `/api/agent/plan`.
- API: Express route in `src/server/index.ts` validates input, starts an agent run, streams normalized SSE events, aborts on disconnect or timeout, and caches identical plans briefly.
- Agent: `src/agent/launchAgent.ts` defines one `Agent` named `Launch Desk`, a fixed instruction prompt, model settings, and a `Runner`.
- Tools: `src/agent/tools.ts` defines four deterministic function tools with Zod parameters:
  - `extract_tasks_from_brief`
  - `check_launch_readiness`
  - `generate_owner_checklists`
  - `draft_channel_copy`
- Streaming: `Runner.run(..., { stream: true })` is normalized into app-level events:
  - `status`
  - `tool_progress`
  - `text_delta`
  - `final`
  - `error`
- State: there is no persisted multi-turn conversation. Runtime state is one launch brief, frontend local state, abort controllers, and a short-lived in-memory cache.
- Tracing: the server uses `workflowName: "Launch Desk release planning"` and `traceIncludeSensitiveData: false`, then flushes traces after the stream.

## What Should Stay On The Current Path

- Keep the single-agent Agents SDK workflow for release planning.
- Keep deterministic planning helpers as function tools, not separate agents.
- Keep the frontend consuming normalized SSE events rather than raw SDK events.
- Keep cache, validation, timeout, and error mapping in the Express layer.
- Keep model selection configurable through `OPENAI_MODEL`.

## What Should Not Migrate

- Do not introduce handoffs until there are real specialist workflows.
- Do not move UI state or app-specific cache behavior into the agent layer.
- Do not expose raw SDK event shapes to the frontend.
- Do not replace the current local tools with model-only reasoning; they are useful deterministic anchors.

## When To Add More Agentic Structure

Add handoffs only when Launch Desk grows into specialist domains with distinct prompts, tools, and evaluation criteria. Good future boundaries:

- Legal or security launch review.
- GTM copy and positioning.
- Analytics and instrumentation readiness.
- Support enablement and escalation planning.
- Human approval before external-facing copy or launch signoff.

Add sessions only when the product supports multi-turn plan refinement. Until then, the current stateless request model is simpler and easier to cache.

Add guardrails when the output becomes safety-critical or externally published, especially to prevent invented approvals, owners, dates, compliance claims, or customer commitments.

## Model Guidance

Default: `gpt-5.4-mini`.

Use this default when the product goal is a fast, cost-conscious planning assistant with deterministic tools and concise output.

Consider `gpt-5.5` or another higher-capability model when:

- Launch inputs become long, ambiguous, or cross-functional.
- The app adds specialist handoffs.
- The output requires deeper risk reasoning.
- Evals show missed dependencies, weak prioritization, or low-quality follow-up questions.

Keep the model override in environment configuration:

```text
OPENAI_MODEL=gpt-5.4-mini
```

## Tests To Maintain Or Add

- Unit tests for deterministic tools: task extraction, readiness scoring, owner checklists, and channel copy.
- Contract tests for agent configuration: model default, required tools, required headings, and brief formatting.
- SSE tests for fragmented parsing and multi-line data events.
- Server utility tests for cache key normalization, cache replay, and public error mapping.
- End-to-end stream verification against the local API when an OpenAI API key is available.
- Future handoff tests if specialist agents are introduced.

## Setup Notes

On Windows PowerShell, `npm` may be blocked by script execution policy because it resolves to `npm.ps1`. Use `npm.cmd` for local verification:

```powershell
npm.cmd test
npm.cmd run build
```

For a real stream smoke test:

```powershell
npm.cmd run dev:server
npm.cmd run verify:stream
```

## Migration Plan

1. Confirm the app has no direct Responses API runtime path.
2. Preserve the `/api/agent/plan` request and SSE response contract.
3. Keep the current single-agent `Launch Desk` implementation.
4. Add contract tests around required tools, headings, model default, and formatted input.
5. Document tracing, model override, Windows verification commands, and future handoff boundaries.
6. Add evals before introducing handoffs or multi-turn sessions.
7. Revisit the architecture only after product requirements demand specialist agents or persistent sessions.

## Rollback Notes

The rollback boundary is `runLaunchDeskStream`. If a future Agents SDK change causes regressions, keep the frontend and `/api/agent/plan` SSE contract stable and swap only the backend implementation behind that generator.

Rollback must preserve:

- `status`, `tool_progress`, `text_delta`, `final`, and `error` event types.
- Existing request schema in `LaunchBrief`.
- Abort-on-disconnect behavior.
- Public error mapping.
- Cache replay behavior.

## Validation Checklist

- [ ] All four tools are available to the agent.
- [ ] Final output includes the five required Markdown headings.
- [ ] Tool progress events are visible in the UI.
- [ ] Text streams progressively before `final`.
- [ ] Client abort cancels server-side work.
- [ ] Cache replay works within `PLAN_CACHE_TTL_MS`.
- [ ] Tracing is enabled server-side with sensitive payload capture disabled.
- [ ] `OPENAI_MODEL` override is documented and works.
- [ ] `npm.cmd test` passes.
- [ ] `npm.cmd run build` passes.
- [ ] `npm.cmd run verify:stream` passes when server and API key are available.
