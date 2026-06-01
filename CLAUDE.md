# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

This is **not a conventional application codebase**. It is the home directory (`~/.openclaw`) of an **OpenClaw gateway runtime** that ALSO serves as the canonical, version-controlled source of truth for two AI agent personas. Most "source" is Markdown persona/config, not code.

Two layers coexist here:

1. **OpenClaw workspace** (root): runtime config, persona docs, memory, and SQLite state for a locally-running OpenClaw gateway. Configured for Windows; the gateway runs via `gateway.cmd` (Node) on port `18789`.
2. **`launch-desk/`**: a self-contained full-stack TypeScript app (OpenAI Agents SDK + React/Vite + Express). It has its own `package.json`, build, and tests — treat it as a separate project.

The root-level `package.json`/`package-lock.json` are near-empty stubs; there is no root build. Real build/test tooling lives only in `launch-desk/`.

## The two agents

- **CLARA** — customer-relationship agent for **Prime Odontologia** (a dental clinic). WhatsApp/Instagram/Google-native, Portuguese-language, patient-safe. Brain: `workspace/CLARA_WHATSAPP_PROMPT.md` + `docs/clara-whatsapp-config.json` + an OpenAI Prompt ID (see `docs/clara-openai-prompt.md`).
- **LUZIA** — governance agent for the PrimeOS App Hub / OpenClaw Control Dashboard. Brain: `workspace/LUZIA_GOVERNMENT_PROMPT.md`; registry `workspace/.openclaw/control-agents.json`.
- **Codex** — the coding/implementation agent (this role).

CLARA's hard guardrails (enforce when editing her persona or skill): never diagnose, prescribe, or promise results; never quote treatment prices without an in-person evaluation; the only fixed price is the R$180 initial consultation; escalate urgent/sensitive cases to humans. See `skills/whatsapp-instagram-google/SKILL.md`.

## The "body parts" documentation model

Agents are documented as anatomical "body parts" (Identity, Soul, Brain, Memory, Senses, Hands, Heartbeat, Immune system, etc.), defined in `docs/agents-body-parts.md`. When **adding or changing an agent**, follow the documentation rule in that file: update the persona/prompt file, the per-agent pack under `docs/agents/<agent-id>/`, `docs/openclaw-control-panel-registry.json`, and (optionally) `workspace/.openclaw/control-agents.json`. The shell scripts `luzia_agent_bodypack_generator.sh` and `agent_bodypack_config.sh` scaffold a full body-parts pack for a new agent.

## Agent runtime conventions (from AGENTS.md)

When operating *as* the OpenClaw agent (not just editing files):
- **Memory is files, not "mental notes."** Daily raw logs go in `memory/YYYY-MM-DD.md`; curated long-term memory in `MEMORY.md`. `MEMORY.md` loads **only in the main session**, never in shared/group contexts (it holds private context).
- Prefer runtime-provided startup context over re-reading `AGENTS.md`/`SOUL.md`/`USER.md`.
- `BOOTSTRAP.md` is one-time setup; it is meant to be deleted after first run.
- Red lines: never exfiltrate private data; prefer recoverable deletes (`trash` over `rm`); ask before anything that leaves the machine (emails, posts, sends).

## launch-desk commands

Run all of these from inside `launch-desk/`:

```bash
npm install
npm run dev            # server (tsx watch) + Vite client concurrently
npm run dev:server     # Express API only (SSE streaming)
npm run dev:client     # Vite client only, bound to 127.0.0.1
npm run build          # tsc -p tsconfig.json && vite build
npm start              # node dist/server/index.js (after build)
npm test               # vitest run (all tests)
npm run verify:stream  # end-to-end SSE stream verification script
```

Run a single test file or test:
```bash
npx vitest run src/tests/tools.test.ts
npx vitest run -t "partial name of test"
```

Requires `.env` in `launch-desk/` (copy from `.env.example`) with an OpenAI project API key. Default model is `gpt-5.4-mini`; override with `OPENAI_MODEL`.

### launch-desk architecture

- `src/agent/` — Agents SDK setup (`launchAgent.ts`), function tools (`tools.ts`).
- `src/server/` — Express routes; the API route runs the agent with `Runner.run(..., { stream: true })` and forwards normalized **Server-Sent Events**.
- `src/frontend/` — React UI + SSE streaming client.
- `src/shared/` — Zod schemas + TS types shared across server/agent/frontend; `sse.ts` defines the event contract.
- `src/tests/` — Vitest unit tests for deterministic tool behavior and the agent contract.

Uses the current `@openai/agents` SDK (agents/tools/handoffs/guardrails/sessions/tracing) — **not** the deprecated Assistants API or legacy Chat Completions. Tools use `tool({ name, description, parameters, execute })` with Zod parameters.

## Running the OpenClaw gateway

The gateway is started by `gateway.cmd` (invokes the globally-installed `openclaw` package via Node, port 18789, loopback bind). Runtime model defaults to `openai/gpt-5.4-mini` (`config.yaml`, `openclaw.json`). Session URL referenced in `BOOTSTRAP.md`.

## Secrets and what is / isn't tracked

`SECURITY.md` is binding: **no live credentials in tracked files** — use placeholders like `REDACTED_CONFIGURE_LOCALLY`, and rotate any token that gets committed. `.gitignore` already excludes `openclaw.json`, `gateway.cmd`, `.env`, `credentials/`, `devices/*.json`, all `*.sqlite*`, `workspace/`, and the agent `auth-*.json` files. The `workspace/` directory holds local runtime state and the live agent prompts (`CLARA_WHATSAPP_PROMPT.md`, `LUZIA_GOVERNMENT_PROMPT.md`) and is intentionally untracked — paths in docs point into it but its contents are local.

When editing config, note `openclaw.json` is the live (untracked) file; `*.bak`, `*.last-good`, and `*.clobbered.*` are its rotated backups.
