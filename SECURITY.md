# Security Notes

This repository should not contain live runtime credentials, paired-device tokens, or local auth state.

## Do Not Commit

- OpenAI API keys
- OpenClaw gateway tokens
- Paired-device tokens
- Codex auth state
- Local credential files
- SQLite runtime state

## Local Configuration

Use local ignored files or the OpenClaw setup flow for credentials and device pairing. Tracked files should contain only placeholders such as `REDACTED_CONFIGURE_LOCALLY`.

If a live token was committed or shown in logs, rotate it in the provider dashboard and regenerate local OpenClaw pairing/auth state.
