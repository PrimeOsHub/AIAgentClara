# OpenClaw Agent Body Parts

Date: 2026-05-30

This document defines how to document every agent in the OpenClaw / PrimeOS ecosystem.

LUZIA owns this map as the AI Agent Government for OpenClaw Control Dashboard management.

## Body Parts Model

| Body part | Meaning | Typical files |
| --- | --- | --- |
| Identity | Who the agent is, owner, domain, role | `IDENTITY.md`, persona docs |
| Soul | Voice, principles, boundaries, values | `SOUL.md`, persona docs |
| Brain | System prompt, prompt ID, model settings | prompt docs, OpenAI prompt IDs |
| Memory | Long-term and daily context | `MEMORY.md`, `memory/YYYY-MM-DD.md`, CRM context |
| Senses | Inputs and channels | WhatsApp, dashboard, browser, GitHub, files, APIs |
| Hands | Tools and actions | skills, MCP tools, channel senders, filesystem actions |
| Heartbeat | Proactive checks and reminders | `HEARTBEAT.md`, automations |
| Skeleton | File structure and runtime contracts | schemas, config files, folders |
| Skin | UI presence | dashboard cards, icons, labels, panels |
| Nervous system | Events, routing, handoffs, traces | gateway logs, traces, registries |
| Immune system | Guardrails and approval gates | red lines, privacy, escalation rules |
| Audit trail | Validation and history | docs, changelogs, tests, checklists |

## CLARA

- Body-parts pack: `docs/agents/clara/`.
- Identity: Prime Odontologia customer relationship agent.
- Soul: warm, objective, patient-safe, WhatsApp-native.
- Brain: `workspace/CLARA_WHATSAPP_PROMPT.md`.
- Custom GPT: `https://chatgpt.com/g/g-692348a724f88191816bba8f8fccb938-clara`.
- Structured config: `docs/clara-whatsapp-config.json`.
- OpenAI Prompt: `docs/clara-openai-prompt.md`.
- Source page: `https://www.notion.so/primeos/36f07bdf47878004b0c2c328bcfe121f?source=copy_link`.
- Senses: WhatsApp and patient messages.
- Hands: WhatsApp/Instagram/Google communication skill.
- Immune system: no diagnosis, no promises, no treatment prices without evaluation, human escalation for urgent/sensitive cases.
- Audit: `docs/openclaw-codex-clara-integration.md`.

## LUZIA

- Body-parts pack: `docs/agents/luzia/`.
- Identity: Government agent for PrimeOS App Hub and OpenClaw Control.
- Soul: formal, clear, governance-minded, accessible.
- Brain: `workspace/LUZIA_GOVERNMENT_PROMPT.md`.
- Custom GPT: `https://chatgpt.com/g/g-6a1b08efb08c8191af2c468bee4bc65d-luzia`.
- Registry: `workspace/.openclaw/control-agents.json`.
- Senses: dashboard state, agent registry, docs, logs, future traces.
- Hands: documentation, routing decisions, governance checklists, dashboard planning.
- Immune system: no invented policies, no private-data exposure, human escalation for legal/regulatory/security decisions.
- Audit: `docs/luzia-openclaw-control-integration.md`.

## Codex

- Body-parts pack: `docs/agents/codex/`.
- Identity: coding and implementation agent.
- Brain: Codex runtime instructions plus workspace docs.
- Senses: repo files, shell, tests, browser tooling.
- Hands: code edits, docs, tests, validation commands.
- Immune system: sandboxing, approvals, non-destructive git behavior.
- Audit: git status, tests, docs, final summaries.

## Documentation Rule

When adding a new agent, create or update:

1. Agent prompt/persona file.
2. Agent body-parts pack under `docs/agents/<agent-id>/`.
3. Entry in `docs/openclaw-control-panel-registry.json`.
4. Optional local runtime entry in `workspace/.openclaw/control-agents.json`.
5. Body-parts section in this document.
6. Integration or runbook doc under `docs/`.
7. Memory note if the integration should survive future sessions.
