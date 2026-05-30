# OpenClaw / Codex / CLARA Integration

Date: 2026-05-30

## Status

CLARA's WhatsApp prompt is integrated into the OpenClaw workspace and Codex runtime context.

## Connected Pieces

- OpenAI Prompt reference:
  - Prompt ID: `pmpt_692f3317d5988193853bae60ded6e87003b5ce12b11ee3a4`
  - Version: `15`
  - Runtime API: Responses API
- Structured WhatsApp configuration:
  - `docs/clara-whatsapp-config.json`
- OpenClaw/Codex runtime prompt:
  - `workspace/CLARA_WHATSAPP_PROMPT.md`
- OpenClaw operational manual:
  - `workspace/AGENTS.md`
  - `workspace/PRIME_ODONTOLOGIA.md`
  - `workspace/SOUL.md`
- GitHub/Codex reusable prompt:
  - `.github/prompts/clara.prompt.md`
- WhatsApp channel skill:
  - `workspace/skills/whatsapp-instagram-google/SKILL.md`
  - `skills/whatsapp-instagram-google/SKILL.md`
- Codex trust configuration:
  - `agents/main/agent/codex-home/config.toml`

## Runtime Behavior

For WhatsApp conversations, CLARA should:

1. Use `workspace/CLARA_WHATSAPP_PROMPT.md` as the main operating prompt.
2. Speak in Brazilian Portuguese.
3. Keep replies short, warm, natural, and WhatsApp-friendly.
4. Ask about the patient's need before offering scheduling.
5. Guide to the initial in-person consultation with Dr. Andre.
6. Inform that the initial consultation costs R$180,00 and lasts approximately 1 hour.
7. Avoid diagnosis, treatment recommendation, promises, and treatment-specific prices without evaluation.
8. Collect full name, main reason, preferred period, and confirmation of the offered time.

## Codex Integration

The Codex home configuration now trusts both:

- `C:\Users\Pugedo\.openclaw\workspace`
- `C:\Users\Pugedo\.openclaw`

This lets Codex work with the runtime OpenClaw workspace and the root configuration/docs where CLARA's prompt artifacts live.

## Validation Checklist

- [ ] In a new OpenClaw/Codex session, ask for a WhatsApp reply as Clara.
- [ ] Confirm the response points to the consultation with Dr. Andre.
- [ ] Confirm the response mentions R$180,00 only for the initial consultation, not treatment prices.
- [ ] Confirm the response avoids diagnosis and treatment recommendation by WhatsApp.
- [ ] Confirm the response asks one concise next-step question.
- [ ] Confirm Codex can read both `workspace/CLARA_WHATSAPP_PROMPT.md` and `docs/clara-whatsapp-config.json`.

## Rollback

To rollback this integration:

1. Remove or ignore `workspace/CLARA_WHATSAPP_PROMPT.md`.
2. Revert references in `workspace/PRIME_ODONTOLOGIA.md`, `workspace/SOUL.md`, `.github/prompts/clara.prompt.md`, and both WhatsApp skill files.
3. Remove the root `.openclaw` trust entry from `agents/main/agent/codex-home/config.toml` if Codex should only trust `workspace/`.
