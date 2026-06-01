@echo off
rem OpenClaw Gateway (v2026.5.28)
set "OPENCLAW_SERVICE_MANAGED_ENV_KEYS=CLAUDE_API_KEY,HOSTINGER_API_KEY,OPENAI_API_KEY,OPENCLAW_GATEWAY_KEY,SUPABASE_API_KEY"
set "TMPDIR=C:\Users\Pugedo\AppData\Local\Temp"
set "OPENCLAW_GATEWAY_PORT=18789"
set "OPENCLAW_SYSTEMD_UNIT=openclaw-gateway.service"
set "OPENCLAW_WINDOWS_TASK_NAME=OpenClaw Gateway"
set "OPENCLAW_SERVICE_MARKER=openclaw"
set "OPENCLAW_SERVICE_KIND=gateway"
set "OPENCLAW_SERVICE_VERSION=2026.5.28"
"C:\Program Files\nodejs\node.exe" C:\Users\Pugedo\AppData\Roaming\npm\node_modules\openclaw\dist\index.js gateway --port 18789
