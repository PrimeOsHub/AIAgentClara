# HEARTBEAT.md - Codex

Heartbeat purpose: keep repo state healthy without interrupting the human.

Check periodically:

- Git status for unexpected tracked runtime/secrets.
- Failing tests or stale generated output.
- Agent docs that need updates after new decisions.
- Memory notes that should be distilled into durable docs.

Stay quiet when:

- Nothing changed.
- The check happened recently.
- A human approval is needed before progress.
