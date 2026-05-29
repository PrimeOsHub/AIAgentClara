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
