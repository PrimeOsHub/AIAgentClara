# Working Preferences

- For migration, setup, or configuration reviews, save the complete configuration and plan in workspace docs when the user approves, rather than leaving the result only in chat.
- CLARA currently has an OpenAI Prompt reference documented in `docs/clara-openai-prompt.md`: `pmpt_692f3317d5988193853bae60ded6e87003b5ce12b11ee3a4`, version `15`.
- CLARA's structured WhatsApp operating configuration is saved in `docs/clara-whatsapp-config.json`.
- CLARA's WhatsApp prompt is integrated into OpenClaw/Codex through `workspace/CLARA_WHATSAPP_PROMPT.md`; Codex is configured to trust both `C:\Users\Pugedo\.openclaw\workspace` and `C:\Users\Pugedo\.openclaw`.
- LUZIA is being integrated as the AI Agent Government for PrimeOS App Hub / OpenClaw Control. Her runtime prompt is `workspace/LUZIA_GOVERNMENT_PROMPT.md`, and the local Control Dashboard registry is `workspace/.openclaw/control-agents.json`.
- LUZIA custom GPT URL: `https://chatgpt.com/g/g-6a1b08efb08c8191af2c468bee4bc65d-luzia`.
- OpenClaw control-panel source of truth: `docs/openclaw-control-panel-registry.json` plus per-agent body-parts packs under `docs/agents/` for Luzia, Clara, and Codex.
- Omnichannel strategy is documented in `docs/omnichannel-strategy.md`; it defines continuity across WhatsApp, Instagram, Google Business, and in-person clinic interactions.
