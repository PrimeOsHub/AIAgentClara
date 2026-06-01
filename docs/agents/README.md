# OpenClaw Agent Control Panel Pack

This folder is the tracked source of truth for agent identity packs used by the OpenClaw control panel.

Each agent folder follows the same body-parts contract:

- `README.md`: quick entry point.
- `IDENTITY.md`: name, role, owner, domain, status.
- `SOUL.md`: voice, values, boundaries.
- `AGENTS.md`: operating rules and routing.
- `USER.md`: human/business context the agent may use.
- `TOOLS.md`: tools, permissions, and external actions.
- `HEARTBEAT.md`: proactive checks and when to stay quiet.
- `MEMORY.md`: curated durable memory for that agent.
- `DREAMS.md`: backlog, future capabilities, and experiments.
- `BOOT.md`: normal startup checklist.
- `BOOTSTRAP.md`: first-run checklist.

Active agents:

- `luzia`: PrimeOS/OpenClaw government and control-panel coordinator.
- `clara`: Prime Odontologia WhatsApp relationship agent.
- `codex`: implementation, repo, tests, and documentation agent.

The control panel should treat this directory as documentation/configuration, not as a secret store.
