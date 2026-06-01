# CLARA OpenAI Prompt Configuration

Date: 2026-05-30

## Purpose

This file records the OpenAI Prompt object currently associated with CLARA, the Prime Odontologia customer relationship agent.

It does not contain an API key or private prompt contents. It only records the reusable prompt reference and the intended API call shape.

## Prompt Reference

- Agent: CLARA - Prime Odontologia
- Custom GPT URL: `https://chatgpt.com/g/g-692348a724f88191816bba8f8fccb938-clara`
- Prompt ID: `pmpt_692f3317d5988193853bae60ded6e87003b5ce12b11ee3a4`
- Prompt version: `15`
- Runtime API: OpenAI Responses API
- Notion source page: `https://www.notion.so/primeos/36f07bdf47878004b0c2c328bcfe121f?source=copy_link`
- Local mirror: `data/prime-clara-notion.md`

## Python Usage

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    prompt={
        "id": "pmpt_692f3317d5988193853bae60ded6e87003b5ce12b11ee3a4",
        "version": "15",
    }
)
```

## Integration Notes

- Keep the Prompt ID and version configurable in runtime configuration rather than hard-coding them deeply in business logic.
- Use this prompt reference for CLARA conversations that should follow the canonical Prime Odontologia persona.
- Use `docs/clara-whatsapp-config.json` as the structured WhatsApp behavior and scheduling configuration for CLARA.
- Use `workspace/CLARA_WHATSAPP_PROMPT.md` as the OpenClaw/Codex runtime prompt for WhatsApp service.
- Keep `PRIME_ODONTOLOGIA_CLARA.md` as the local human-readable source of CLARA behavior and operating boundaries.
- Treat the OpenAI prompt version as a deployable artifact. When the prompt changes in the OpenAI platform, record the new version here with date and reason.
- Do not store `OPENAI_API_KEY` in this file.

## Validation Checklist

- [ ] `OPENAI_API_KEY` is configured in the runtime environment.
- [ ] The API key has access to the project that owns the prompt ID.
- [ ] The prompt version exists and is active.
- [ ] A smoke request returns a CLARA-style response in Brazilian Portuguese.
- [ ] The response avoids diagnosis, clinical promises, and unauthorized pricing.
- [ ] Human handoff still happens for urgent, clinical, sensitive, or out-of-scope cases.

## Change Log

- 2026-05-30: Recorded CLARA prompt ID `pmpt_692f3317d5988193853bae60ded6e87003b5ce12b11ee3a4`, version `15`.
- 2026-05-30: Added structured WhatsApp configuration at `docs/clara-whatsapp-config.json`.
- 2026-05-30: Integrated CLARA WhatsApp prompt into OpenClaw/Codex runtime via `workspace/CLARA_WHATSAPP_PROMPT.md`.
- 2026-06-01: Recorded Clara Custom GPT URL and canonical Notion source page.
