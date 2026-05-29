# Launch Desk

Launch Desk is a full-stack OpenAI Agents SDK app that helps engineering teams turn a rough launch idea into an actionable release plan. The frontend collects a product brief, audience, launch date, constraints, and available assets. The backend streams the agent response as Server-Sent Events.

## What It Produces

- Prioritized release plan
- Risk register
- Owner checklist
- Channel-specific launch copy suggestions
- Follow-up questions when key details are missing

## Project Structure

```text
launch-desk/
  src/frontend/         React UI and streaming client
  src/server/           Express API routes and environment loading
  src/agent/            Agents SDK setup, instructions, tools
  src/shared/           Shared Zod schemas and TypeScript types
  src/tests/            Unit tests for deterministic tool behavior
  scripts/              End-to-end stream verification script
```

## OpenAI SDK Notes

This project uses the current OpenAI Agents SDK for TypeScript via `@openai/agents`. It does not use the deprecated Assistants API or legacy Chat Completions scaffolding.

The implementation follows current OpenAI guidance:

- Agents SDK primitives include agents, tools, handoffs, guardrails, sessions, and tracing.
- Streaming is enabled with `Runner.run(..., { stream: true })`; the API route forwards normalized SSE events.
- Function tools use `tool({ name, description, parameters, execute })` with Zod parameters.
- Tracing is enabled by default in Node server runtimes; the server sets `workflowName` and disables sensitive trace payload capture.
- The default model is `gpt-5.4-mini`, which the model docs position as a lower-latency, lower-cost current model. Override with `OPENAI_MODEL`.

References:

- https://openai.github.io/openai-agents-js/
- https://openai.github.io/openai-agents-js/guides/streaming/
- https://openai.github.io/openai-agents-js/guides/tools/
- https://openai.github.io/openai-agents-js/guides/tracing/
- https://developers.openai.com/api/docs/models

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env`:

   ```bash
   cp .env.example .env
   ```

3. Add a project API key:

   ```bash
   OPENAI_API_KEY=sk-proj-...
   OPENAI_MODEL=gpt-5.4-mini
   PORT=8787
   CLIENT_ORIGIN=http://127.0.0.1:5173
   ```

   In this OpenClaw workspace, the server also falls back to `../credentials/openai_project_api_key.env` if `.env` is absent.

4. Run the app:

   ```bash
   npm run dev
   ```

5. Open:

   ```text
   http://127.0.0.1:5173
   ```

## API

`POST /api/agent/plan`

Request:

```json
{
  "productBrief": "Launch a beta analytics dashboard...",
  "audience": "Engineering managers",
  "launchDate": "2026-06-19",
  "constraints": "Security review and phased rollout required.",
  "availableAssets": "Figma prototype, pilot notes, FAQ outline"
}
```

Response stream:

```text
data: {"type":"status","message":"Launch Desk agent started"}
data: {"type":"tool_progress","toolName":"extract_tasks_from_brief","phase":"started"}
data: {"type":"text_delta","delta":"## Prioritized release plan"}
data: {"type":"final","text":"..."}
```

## Tests And Verification

Run deterministic tool tests:

```bash
npm test
```

Run TypeScript and frontend build:

```bash
npm run build
```

Verify the real local API stream, including OpenAI API access:

```bash
npm run dev:server
npm run verify:stream
```

The verification script posts a realistic launch brief to `http://127.0.0.1:8787/api/agent/plan` and reads the stream until it receives at least one `tool_progress` event and one `text_delta` event. This is intentionally stronger than a health check.

## Extending Launch Desk

- Add new deterministic tools in `src/agent/tools.ts`.
- Register tools in `launchPlanningTools`.
- Update `launchDeskAgent.instructions` in `src/agent/launchAgent.ts`.
- Add tests for new tool behavior in `src/tests/`.
- Keep server route streaming normalized events so the frontend stays decoupled from raw SDK event shapes.
