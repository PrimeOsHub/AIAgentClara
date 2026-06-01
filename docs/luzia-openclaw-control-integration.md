# LUZIA OpenClaw Control Integration

Date: 2026-05-30

## Goal

Integrate LUZIA, the AI Agent Government for PrimeOS App Hub, into OpenClaw Control so she can coordinate all agents working together in OpenClaw.

## Current State

- LUZIA persona exists at `GOVERNMENT_PRIMEOS_LUZIA.md`.
- LUZIA custom GPT URL is recorded as `https://chatgpt.com/g/g-6a1b08efb08c8191af2c468bee4bc65d-luzia`.
- LUZIA runtime prompt has been added at `workspace/LUZIA_GOVERNMENT_PROMPT.md`.
- Control registry has been started at `workspace/.openclaw/control-agents.json`.
- Tracked control-panel registry exists at `docs/openclaw-control-panel-registry.json`.
- Complete body-parts packs exist under `docs/agents/` for LUZIA, CLARA, and Codex.
- Agent body-parts documentation has been started at `docs/agents-body-parts.md`.
- CLARA is already integrated for WhatsApp via `workspace/CLARA_WHATSAPP_PROMPT.md`.
- Codex is enabled and trusted for both `C:\Users\Pugedo\.openclaw\workspace` and `C:\Users\Pugedo\.openclaw`.

## Process

1. Treat LUZIA as the dashboard governor.
2. Keep agent definitions in `workspace/.openclaw/control-agents.json`.
3. Keep the tracked dashboard registry in `docs/openclaw-control-panel-registry.json`.
4. Keep human-readable body-parts documentation in `docs/agents-body-parts.md` and `docs/agents/`.
5. Keep each agent's operational prompt in `workspace/`.
6. Keep deep configuration or prompt IDs in `docs/`.
7. Let Codex implement dashboard changes after LUZIA defines governance and contracts.

## Dashboard Contract

The OpenClaw Control Dashboard should be able to read or mirror this shape for each agent:

```json
{
  "id": "luzia",
  "display_name": "LUZIA",
  "type": "government_orchestration_agent",
  "business_domain": "PrimeOS App Hub / OpenClaw",
  "primary_channel": "openclaw_control_dashboard",
  "role": "AI Agent Government for OpenClaw Custom Dashboard management and cross-agent coordination.",
  "status": "integration_started",
  "prompt_reference": {
    "provider": "openai",
    "api": "chatgpt_custom_gpt",
    "id": "g-6a1b08efb08c8191af2c468bee4bc65d-luzia",
    "url": "https://chatgpt.com/g/g-6a1b08efb08c8191af2c468bee4bc65d-luzia"
  },
  "body_parts": {
    "identity": "docs/agents/luzia/IDENTITY.md",
    "soul": "docs/agents/luzia/SOUL.md",
    "agents": "docs/agents/luzia/AGENTS.md",
    "user": "docs/agents/luzia/USER.md",
    "tools": "docs/agents/luzia/TOOLS.md",
    "heartbeat": "docs/agents/luzia/HEARTBEAT.md",
    "memory": "docs/agents/luzia/MEMORY.md",
    "dreams": "docs/agents/luzia/DREAMS.md",
    "boot": "docs/agents/luzia/BOOT.md",
    "bootstrap": "docs/agents/luzia/BOOTSTRAP.md",
    "brain": "workspace/LUZIA_GOVERNMENT_PROMPT.md",
    "registry": "docs/openclaw-control-panel-registry.json"
  }
}
```

## Recommended Control UI Sections

- Agents overview
- Agent body parts
- Prompt/config versions
- Channels and tools
- Handoffs and routing
- Safety and approval gates
- Logs, traces, and recent activity
- Validation checklist
- Pending governance tasks

## LUZIA Routing Rules

- CLARA: patient-facing Prime Odontologia WhatsApp communication.
- LUZIA: governance, dashboard, registry, compliance, app hub policies.
- Codex: implementation, repo edits, tests, app/runtime changes.
- Human owner: legal, clinical, financial, regulatory, and external-send approvals.

## Next Implementation Steps

1. Decide whether the Control Dashboard will read `docs/openclaw-control-panel-registry.json` directly or copy it into its own app state.
2. Add an Agents panel to the dashboard with cards for CLARA, LUZIA, and Codex.
3. Add a Body Parts detail view for each agent.
4. Add validation state for each agent: configured, needs prompt ID, needs tests, needs channel verification.
5. Add a governance checklist owned by LUZIA.
6. Add a handoff log so cross-agent routing is visible.

## Validation Checklist

- [ ] New OpenClaw/Codex sessions know that LUZIA owns governance and dashboard coordination.
- [x] `docs/openclaw-control-panel-registry.json` contains CLARA, LUZIA, and Codex.
- [x] `docs/agents/` contains body-parts packs for CLARA, LUZIA, and Codex.
- [ ] `workspace/.openclaw/control-agents.json` mirrors CLARA, LUZIA, and Codex if the local runtime dashboard reads that file.
- [ ] CLARA remains the only patient-facing dental relationship agent.
- [ ] LUZIA does not answer clinical patient questions except to route to CLARA.
- [ ] Dashboard implementation uses the registry fields without exposing secrets.
- [x] LUZIA custom GPT URL is recorded in the registry and docs.
- [ ] Any future LUZIA OpenAI prompt ID/version is recorded in the registry and docs if exposed separately from the GPT URL.

## Rollback

To rollback this integration:

1. Remove `workspace/LUZIA_GOVERNMENT_PROMPT.md`.
2. Remove or ignore `workspace/.openclaw/control-agents.json`.
3. Remove `docs/agents/luzia/` and Luzia's entry from `docs/openclaw-control-panel-registry.json`.
4. Remove LUZIA references from `workspace/AGENTS.md`.
5. Keep `GOVERNMENT_PRIMEOS_LUZIA.md` as the standalone persona file if needed.
