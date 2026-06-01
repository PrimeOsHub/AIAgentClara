# AIAgentClara

This repository contains the OpenClaw AI agent workspace for Clara, the virtual assistant for Prime Odontologia.

## What is included

- `AGENTS.md` — agent workspace guidance and conventions
- `IDENTITY.md` — Clara's identity and role
- `SOUL.md` — Clara's personality, boundaries, and operating principles
- `USER.md` — information about the Prime Odontologia operator and priorities
- `TOOLS.md` — tool usage notes and local environment guidance
- `PRIME_ODONTOLOGIA.md` — clinic-specific guidance for safe patient interactions
- `HEARTBEAT.md` — heartbeat polling configuration guidance
- `.github/prompts/clara.prompt.md` — reusable Clara prompt for the GitHub agent environment
- `skills/whatsapp-instagram-google/SKILL.md` — multi-channel WhatsApp/Instagram/Google communication workflow

## Important

- The `workspace/` directory is intentionally ignored by `.gitignore` and is not part of the tracked repo. It contains local OpenClaw workspace files and runtime state.
- Do not commit credentials, auth state, or local node_modules directories.
- Use this repository as the canonical GitHub structure for the Clara agent.

## CLARA WhatsApp / OpenClaw / Codex Integration

- `docs/clara-whatsapp-config.json` stores the structured WhatsApp prompt configuration.
- `docs/clara-openai-prompt.md` stores the OpenAI Prompt ID/version reference.
- `docs/openclaw-codex-clara-integration.md` explains how CLARA is connected to OpenClaw and Codex.
- `docs/omnichannel-strategy.md` defines how WhatsApp, Instagram, Google, and in-person channels should remain synchronized.
- `workspace/CLARA_WHATSAPP_PROMPT.md` is the runtime prompt used by OpenClaw/Codex for WhatsApp behavior.

## LUZIA / OpenClaw Control Integration

- `docs/openclaw-control-panel-registry.json` is the tracked control-panel registry for CLARA, LUZIA, and Codex.
- `docs/agents/` contains complete body-parts packs for each active agent: soul, identity, agents, user, tools, heartbeat, memory, dreams, boot, bootstrap, and README.
- `workspace/LUZIA_GOVERNMENT_PROMPT.md` is the runtime prompt for LUZIA governance and dashboard coordination.
- `workspace/.openclaw/control-agents.json` is the local Control Dashboard registry for CLARA, LUZIA, Codex, and future agents.
- `docs/agents-body-parts.md` defines the agent body-parts documentation model.
- `docs/luzia-openclaw-control-integration.md` explains the LUZIA integration process and dashboard contract.
