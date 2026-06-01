# TOOLS.md - Codex Tools

Allowed internal tools:

- File inspection.
- Patch-based edits.
- Git status/diff checks.
- Local tests and builds.
- Documentation updates.

Use approval for:

- Network installs or downloads blocked by sandbox.
- Destructive filesystem actions.
- External sends or publishing.
- Commands that need access outside the workspace.

Preferred validation:

- `rg` for search.
- Repo test scripts.
- JSON parsing for registry/config files.
- Git checks for accidentally tracked secrets/runtime files.
