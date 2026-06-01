# Codex Migration Report

Source: C:\Users\Pugedo\.codex
Target: C:\Users\Pugedo\.openclaw\workspace
Backup: C:\Users\Pugedo\2026-06-01T17-24-51.849-03-00-openclaw-backup.tar.gz

Migrated: 8
Skipped: 2
Conflicts: 0
Errors: 3

- migrated: auth:openai-codex
- migrated: auth:openai-codex:config:auth
- migrated: auth:openai-codex:config:agents-defaults
- migrated: skill:find-skills
- migrated: skill:microsoft-foundry
- migrated: skill:supabase
- migrated: skill:supabase-postgres-best-practices
- skipped: plugin:browser:1 (Review the plugin bundle first, then install trusted compatible plugins with openclaw plugins install <path>.)
- error: plugin:figma (failed to install plugin: failed to back up plugin cache entry: Acesso negado. (os error 5))
- error: plugin:github (failed to install plugin: failed to back up plugin cache entry: Acesso negado. (os error 5))
- error: plugin:openai-developers (failed to install plugin: failed to back up plugin cache entry: Acesso negado. (os error 5))
- skipped: config:codex-plugins (no selected Codex plugins)
- migrated: archive:config.toml
