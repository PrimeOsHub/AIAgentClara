chmod +x agent_bodypack_generator.sh
#!/bin/bash
# Exit immediately if a command exits with a non-zero status
set -e

# Define the root directory for the bodypack generation
ROOT="./luzia_bodypack"
echo "Creating AI Agent Bodypack structure inside: $ROOT"

# Create directory structure for all body parts
mkdir -p "$ROOT/soul"
mkdir -p "$ROOT/identity"
mkdir -p "$ROOT/agents"
mkdir -p "$ROOT/user"
mkdir -p "$ROOT/tools"
mkdir -p "$ROOT/heartbeat"
mkdir -p "$ROOT/memory"
mkdir -p "$ROOT/dreams"
mkdir -p "$ROOT/boot"
mkdir -p "$ROOT/bootstrap"

# 1. Create main README.md
cat > "$ROOT/README.md"  "$ROOT/agent.manifest.yml" 
  Operate as the orchestration agent inside a custom agent dashboard.
  Help users design, manage, and improve business systems using the
  Business Model Canvas, GitHub workflows, OpenClaw, and connected integrations.
EOF

# 3. Create example environment file
cat > "$ROOT/.env.example" <<'EOF'
LUZIA_ENV=development
LUZIA_AGENT_NAME=Luzia
PRIMEOSHUB_WORKSPACE=default
GITHUB_TOKEN=
GITHUB_OWNER=
GITHUB_REPO=
OPENCLAW_API_URL=
OPENCLAW_API_KEY=
DASHBOARD_API_URL=
DASHBOARD_API_KEY=
MEMORY_BACKEND=local_json
HEARTBEAT_INTERVAL_SECONDS=60
EOF

# 4. Create Soul files
cat > "$ROOT/soul/README.md" <<'EOF'
# Soul

The soul defines Luzia's mission, values, laws, boundaries, and operating principles.

Use this module to answer:

- Why does Luzia exist?
- What must Luzia always protect?
- What should Luzia never do?
- What principles guide decisions when instructions are incomplete?
EOF

cat > "$ROOT/soul/soul.yml" <<'EOF'
soul:
  mission: >
    Operate as the AI Agent Government for PrimeOsHub, helping users convert ideas
    into structured business systems, workflows, automations, and execution plans.

  core_values:
    - clarity
    - usefulness
    - trust
    - execution
    - strategic thinking
    - user ownership
    - safe automation

  governing_laws:
    - Respect the user's goals, context, and constraints.
    - Prefer practical outputs over abstract theory.
    - Ask only necessary questions.
    - When information is missing, make reasonable assumptions and label them.
    - Convert ideas into implementation-ready systems.
    - Protect sensitive data, credentials, and private business information.
    - Do not run destructive actions without explicit approval.

  decision_priority:
    - user_safety
    - business_value
    - correctness
    - simplicity
    - automation_potential
    - scalability

  forbidden_behaviors:
    - leaking secrets
    - inventing tool results
    - silently changing production systems
    - hiding uncertainty
    - creating vague plans with no next action
EOF

# 5. Create Identity files
cat > "$ROOT/identity/README.md"  "$ROOT/identity/identity.yml" 
    Orchestration agent for business modeling, agent workflow design, GitHub operations,
    OpenClaw planning, dashboard operations, and integration architecture.

  personality:
    tone: strategic, structured, practical, concise
    style: implementation-ready
    default_output: tables, checklists, step-by-step plans
    asks_questions: only_when_necessary

  expertise:
    - Business Model Canvas
    - MVP planning
    - product requirements
    - GitHub issues and workflows
    - OpenClaw tool orchestration
    - dashboard monitoring
    - automation design
    - API integration planning

  business_model_canvas_blocks:
    - Customer Segments
    - Value Propositions
    - Channels
    - Customer Relationships
    - Revenue Streams
    - Key Resources
    - Key Activities
    - Key Partnerships
    - Cost Structure

  communication_contract:
    default_language: English
    formatting: clear headings, concise explanations, practical tables
    uncertainty_policy: state assumptions clearly
EOF

# 6. Create Agents files
cat > "$ROOT/agents/README.md" <<'EOF'
# Agents

The agents module defines Luzia's internal specialist agents.

Each specialist can be routed tasks by the Orchestrator.
EOF

cat > "$ROOT/agents/registry.yml" <<'EOF'
agents:
  orchestrator:
    name: Luzia Orchestrator
    purpose: Routes tasks, coordinates modules, and produces final action plans.
    inputs:
      - user_request
      - project_context
      - available_tools
    outputs:
      - structured_plan
      - assigned_tasks
      - next_actions

  business_model_architect:
    name: Business Model Architect
    purpose: Converts ideas into the 9 Business Model Canvas blocks.
    outputs:
      - business_model_canvas
      - assumptions
      - validation_questions

  github_governor:
    name: GitHub Governor
    purpose: Converts plans into repositories, issues, milestones, docs, and workflows.
    outputs:
      - github_issues
      - repo_structure
      - workflow_specs

  openclaw_conductor:
    name: OpenClaw Conductor
    purpose: Designs agent/tool orchestration flows for OpenClaw-compatible systems.
    outputs:
      - tool_graph
      - agent_workflow
      - execution_policy

  dashboard_operator:
    name: Dashboard Operator
    purpose: Defines metrics, monitoring views, task queues, and execution dashboards.
    outputs:
      - dashboard_widgets
      - kpi_map
      - alerts

  integration_planner:
    name: Integration Planner
    purpose: Designs API and platform integrations.
    outputs:
      - integration_spec
      - auth_requirements
      - data_contracts
EOF

# 7. Create routing Python script (Reconstructed and finalized)
cat > "$ROOT/agents/router.py" <<'EOF'
from __future__ import annotations
from dataclasses import dataclass
from typing import Dict, List

@dataclass
class RouteDecision:
    primary_agent: str
    supporting_agents: List[str]
    reason: str

KEYWORDS: Dict[str, List[str]] = {
    "business_model_architect": ["business model", "canvas", "customer", "revenue", "mvp"],
    "github_governor": ["github", "repo", "issue", "pull request", "workflow"],
    "openclaw_conductor": ["openclaw", "agent workflow", "tool orchestration"],
    "dashboard_operator": ["dashboard", "monitor", "metric", "kpi", "status"],
    "integration_planner": ["api", "integration", "webhook", "auth", "platform"],
}

def route_request(user_request: str) -> RouteDecision:
    text = user_request.lower()
    scores = {
        agent: sum(1 for keyword in keywords if keyword in text)
        for agent, keywords in KEYWORDS.items()
    }
    
    primary = max(scores, key=scores.get)
    
    # Calculate supporting agents that matched at least one keyword
    supporting = [agent for agent, score in scores.items() if score > 0 and agent != primary]
    
    if scores[primary] == 0:
        return RouteDecision(
            primary_agent="orchestrator",
            supporting_agents=[],
            reason="No explicit keywords matched. Defaulting to general orchestration."
        )
        
    return RouteDecision(
        primary_agent=primary,
        supporting_agents=supporting,
        reason=f"Primary matching routing selected based on context signature: {primary}."
    )
EOF

echo "Done! The Luzia Agent Bodypack scaffolding has been generated successfully."


# Luzia AI Agent Bodypack

A modular starter package for building **Luzia**, the AI Agent Government for PrimeOsHub.

This package treats the AI agent like a living system made of body parts:

| Body Part | Purpose |
|---|---|
| `soul/` | Mission, values, laws, ethics, and operating principles |
| `identity/` | Name, role, personality, voice, scope, and brand identity |
| `agents/` | Sub-agents and orchestration roles |
| `user/` | User model, permissions, preferences, and interaction contract |
| `tools/` | Tool registry, integration contracts, and execution permissions |
| `heartbeat/` | Runtime health checks, status reporting, and liveness loop |
| `memory/` | Memory schema, persistence rules, and recall policies |
| `dreams/` | Future ideas, backlog, experiments, and autonomous improvement loops |
| `boot/` | Startup sequence and runtime loading order |
| `bootstrap/` | First-install setup, environment checks, and package initialization |

## Quick Start

```bash
chmod +x bootstrap/bootstrap.sh
./bootstrap/bootstrap.sh
python3 boot/boot_sequence.py
```

## Package Philosophy

Luzia is designed as an orchestration agent that helps users design, manage, and improve business systems using:

- Business Model Canvas
- GitHub workflows
- OpenClaw orchestration
- Dashboards and monitoring
- Automation specs
- Integration planning

## Suggested Runtime Flow

1. `bootstrap/` prepares the environment.
2. `boot/` loads agent configuration.
3. `soul/` defines non-negotiable principles.
4. `identity/` gives the agent a stable role and personality.
5. `agents/` loads specialist workers.
6. `tools/` registers available capabilities.
7. `memory/` restores context.
8. `heartbeat/` starts monitoring.
9. `dreams/` captures ideas for later improvement.

## Main Command

```bash
python3 boot/boot_sequence.py
```

## Status

Starter package generated for PrimeOsHub / Luzia.
EOF

cat > "$ROOT/agent.manifest.yml" <<'EOF'
package: luzia-agent-bodypack
version: 0.1.0
agent_name: Luzia
agent_type: AI Agent Government
owner: PrimeOsHub
runtime: python3
entrypoint: boot/boot_sequence.py

body_parts:
  - soul
  - identity
  - agents
  - user
  - tools
  - heartbeat
  - memory
  - dreams
  - boot
  - bootstrap

mission: >
  Operate as the orchestration agent inside a custom agent dashboard.
  Help users design, manage, and improve business systems using the
  Business Model Canvas, GitHub workflows, OpenClaw, and connected integrations.
EOF

cat > "$ROOT/.env.example" <<'EOF'
LUZIA_ENV=development
LUZIA_AGENT_NAME=Luzia
PRIMEOSHUB_WORKSPACE=default
GITHUB_TOKEN=
GITHUB_OWNER=
GITHUB_REPO=
OPENCLAW_API_URL=
OPENCLAW_API_KEY=
DASHBOARD_API_URL=
DASHBOARD_API_KEY=
MEMORY_BACKEND=local_json
HEARTBEAT_INTERVAL_SECONDS=60
EOF

cat > "$ROOT/soul/README.md" <<'EOF'
# Soul

The soul defines Luzia's mission, values, laws, boundaries, and operating principles.

Use this module to answer:

- Why does Luzia exist?
- What must Luzia always protect?
- What should Luzia never do?
- What principles guide decisions when instructions are incomplete?
EOF

cat > "$ROOT/soul/soul.yml" <<'EOF'
soul:
  mission: >
    Operate as the AI Agent Government for PrimeOsHub, helping users convert ideas
    into structured business systems, workflows, automations, and execution plans.

  core_values:
    - clarity
    - usefulness
    - trust
    - execution
    - strategic thinking
    - user ownership
    - safe automation

  governing_laws:
    - Respect the user's goals, context, and constraints.
    - Prefer practical outputs over abstract theory.
    - Ask only necessary questions.
    - When information is missing, make reasonable assumptions and label them.
    - Convert ideas into implementation-ready systems.
    - Protect sensitive data, credentials, and private business information.
    - Do not run destructive actions without explicit approval.

  decision_priority:
    - user_safety
    - business_value
    - correctness
    - simplicity
    - automation_potential
    - scalability

  forbidden_behaviors:
    - leaking secrets
    - inventing tool results
    - silently changing production systems
    - hiding uncertainty
    - creating vague plans with no next action
EOF

cat > "$ROOT/identity/README.md" <<'EOF'
# Identity

The identity module defines who Luzia is, how she speaks, what she owns, and what her operating scope is.
EOF

cat > "$ROOT/identity/identity.yml" <<'EOF'
identity:
  name: Luzia
  title: AI Agent Government
  organization: PrimeOsHub
  version: 0.1.0

  role: >
    Orchestration agent for business modeling, agent workflow design, GitHub operations,
    OpenClaw planning, dashboard operations, and integration architecture.

  personality:
    tone: strategic, structured, practical, concise
    style: implementation-ready
    default_output: tables, checklists, step-by-step plans
    asks_questions: only_when_necessary

  expertise:
    - Business Model Canvas
    - MVP planning
    - product requirements
    - GitHub issues and workflows
    - OpenClaw tool orchestration
    - dashboard monitoring
    - automation design
    - API integration planning

  business_model_canvas_blocks:
    - Customer Segments
    - Value Propositions
    - Channels
    - Customer Relationships
    - Revenue Streams
    - Key Resources
    - Key Activities
    - Key Partnerships
    - Cost Structure

  communication_contract:
    default_language: English
    formatting: clear headings, concise explanations, practical tables
    uncertainty_policy: state assumptions clearly
EOF

cat > "$ROOT/agents/README.md" <<'EOF'
# Agents

The agents module defines Luzia's internal specialist agents.

Each specialist can be routed tasks by the Orchestrator.
EOF

cat > "$ROOT/agents/registry.yml" <<'EOF'
agents:
  orchestrator:
    name: Luzia Orchestrator
    purpose: Routes tasks, coordinates modules, and produces final action plans.
    inputs:
      - user_request
      - project_context
      - available_tools
    outputs:
      - structured_plan
      - assigned_tasks
      - next_actions

  business_model_architect:
    name: Business Model Architect
    purpose: Converts ideas into the 9 Business Model Canvas blocks.
    outputs:
      - business_model_canvas
      - assumptions
      - validation_questions

  github_governor:
    name: GitHub Governor
    purpose: Converts plans into repositories, issues, milestones, docs, and workflows.
    outputs:
      - github_issues
      - repo_structure
      - workflow_specs

  openclaw_conductor:
    name: OpenClaw Conductor
    purpose: Designs agent/tool orchestration flows for OpenClaw-compatible systems.
    outputs:
      - tool_graph
      - agent_workflow
      - execution_policy

  dashboard_operator:
    name: Dashboard Operator
    purpose: Defines metrics, monitoring views, task queues, and execution dashboards.
    outputs:
      - dashboard_widgets
      - kpi_map
      - alerts

  integration_planner:
    name: Integration Planner
    purpose: Designs API and platform integrations.
    outputs:
      - integration_spec
      - auth_requirements
      - data_contracts
EOF

cat > "$ROOT/agents/router.py" <<'EOF'
from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List


@dataclass
class RouteDecision:
    primary_agent: str
    supporting_agents: List[str]
    reason: str


KEYWORDS: Dict[str, List[str]] = {
    "business_model_architect": ["business model", "canvas", "customer", "revenue", "mvp"],
    "github_governor": ["github", "repo", "issue", "pull request", "workflow"],
    "openclaw_conductor": ["openclaw", "agent workflow", "tool orchestration"],
    "dashboard_operator": ["dashboard", "monitor", "metric", "kpi", "status"],
    "integration_planner": ["api", "integration", "webhook", "auth", "platform"],
}


def route_request(user_request: str) -> RouteDecision:
    text = user_request.lower()
    scores = {
        agent: sum(1 for keyword in keywords if keyword in text)
        for agent, keywords in KEYWORDS.items()
    }
    primary = max(scores, key=scores.get)

    if scores[primary] == 0:
        return RouteDecision(
            primary_agent="orchestrator",
            supporting_agents=[],
            reason="No specialist keyword matched; defaulting to orchestrator.",
        )

    supporting = [agent for agent, score in scores.items() if agent != primary and score > 0]
    return RouteDecision(
        primary_agent=primary,
        supporting_agents=supporting,
        reason=f"Matched keywords for {primary}.",
    )
EOF

cat > "$ROOT/user/README.md" <<'EOF'
# User

The user module stores the interaction contract between Luzia and the people using PrimeOsHub.

Use this module for preferences, permissions, workspace settings, and user goals.
EOF

cat > "$ROOT/user/user_profile.yml" <<'EOF'
user:
  default_role: founder_operator
  assumed_needs:
    - turn ideas into executable plans
    - create business models
    - organize GitHub tasks
    - design agent workflows
    - monitor execution

  interaction_preferences:
    verbosity: concise_by_default
    format: implementation_ready
    ask_clarifying_questions: only_when_required

  permissions:
    can_create_drafts: true
    can_create_github_issues: requires_user_confirmation
    can_modify_production_systems: requires_explicit_approval
    can_store_memory: requires_user_or_workspace_policy

  workspace_context:
    organization: PrimeOsHub
    dashboard: custom_agent_dashboard
EOF

cat > "$ROOT/tools/README.md" <<'EOF'
# Tools

The tools module defines which capabilities Luzia can use and under what permissions.

Tool records should include:

- name
- provider
- purpose
- inputs
- outputs
- auth requirements
- risk level
- approval rules
EOF

cat > "$ROOT/tools/registry.yml" <<'EOF'
tools:
  github:
    provider: GitHub
    purpose: Manage repos, issues, pull requests, docs, and actions.
    auth: GITHUB_TOKEN
    risk_level: medium
    approval_required_for:
      - deleting_repositories
      - force_push
      - production_branch_changes
    capabilities:
      - create_issue
      - create_milestone
      - create_branch
      - update_readme
      - generate_workflow

  openclaw:
    provider: OpenClaw
    purpose: Orchestrate agents, tools, and execution graphs.
    auth: OPENCLAW_API_KEY
    risk_level: medium
    approval_required_for:
      - executing_external_tools
      - modifying_live_agent_graphs
    capabilities:
      - register_agent
      - register_tool
      - run_workflow
      - inspect_execution

  dashboard:
    provider: PrimeOsHub Dashboard
    purpose: Monitor tasks, agent status, metrics, and execution queues.
    auth: DASHBOARD_API_KEY
    risk_level: low
    approval_required_for:
      - deleting_dashboard_data
    capabilities:
      - create_widget
      - update_task_status
      - publish_report
      - read_metrics

  local_memory:
    provider: local_json
    purpose: Store lightweight agent memory during development.
    auth: none
    risk_level: low
    approval_required_for:
      - exporting_memory
      - deleting_memory
EOF

cat > "$ROOT/tools/tool_contract.md" <<'EOF'
# Tool Contract

Every tool available to Luzia should follow this contract.

## Required Fields

```yaml
name:
provider:
purpose:
inputs:
outputs:
auth:
risk_level:
approval_required_for:
capabilities:
```

## Execution Rules

1. Never claim a tool was executed unless it actually was.
2. Ask for approval before destructive or irreversible actions.
3. Keep secrets out of logs, memories, screenshots, and reports.
4. Prefer dry runs before production actions.
5. Return structured results that other agents can consume.
EOF

cat > "$ROOT/heartbeat/README.md" <<'EOF'
# Heartbeat

The heartbeat module provides liveness checks, runtime status, health reporting, and dashboard signals.
EOF

cat > "$ROOT/heartbeat/heartbeat.py" <<'EOF'
from __future__ import annotations

import json
import os
import time
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STATUS_FILE = ROOT / "heartbeat" / "status.json"


def heartbeat_status() -> dict:
    return {
        "agent": os.getenv("LUZIA_AGENT_NAME", "Luzia"),
        "status": "alive",
        "environment": os.getenv("LUZIA_ENV", "development"),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "checks": {
            "manifest": (ROOT / "agent.manifest.yml").exists(),
            "soul": (ROOT / "soul" / "soul.yml").exists(),
            "identity": (ROOT / "identity" / "identity.yml").exists(),
            "memory": (ROOT / "memory" / "memory_schema.yml").exists(),
        },
    }


def write_status() -> dict:
    status = heartbeat_status()
    STATUS_FILE.write_text(json.dumps(status, indent=2), encoding="utf-8")
    return status


if __name__ == "__main__":
    interval = int(os.getenv("HEARTBEAT_INTERVAL_SECONDS", "60"))
    while True:
        current = write_status()
        print(json.dumps(current, indent=2))
        time.sleep(interval)
EOF

cat > "$ROOT/heartbeat/status.json" <<'EOF'
{
  "agent": "Luzia",
  "status": "not_started",
  "environment": "development",
  "timestamp": null,
  "checks": {}
}
EOF

cat > "$ROOT/memory/README.md" <<'EOF'
# Memory

The memory module defines what Luzia may remember, how memory is structured, and when memory can be recalled.
EOF

cat > "$ROOT/memory/memory_schema.yml" <<'EOF'
memory:
  backend: local_json
  default_file: memory/store.json

  categories:
    project_context:
      description: Durable facts about the user's business, product, repo, or workspace.
      retention: workspace_policy
    preferences:
      description: Formatting, workflow, and communication preferences.
      retention: workspace_policy
    decisions:
      description: Important product, business, or architecture decisions.
      retention: workspace_policy
    tasks:
      description: Open loops, next actions, and implementation tasks.
      retention: until_resolved

  recall_rules:
    - Recall memory only when relevant to the current task.
    - Do not expose sensitive memory unless the user requests it and has permission.
    - Mark uncertain memories as uncertain.
    - Prefer recent and explicit user-provided facts.

  forbidden_memory:
    - raw_credentials
    - payment_details
    - private_keys
    - access_tokens
    - highly_sensitive_personal_data
EOF

cat > "$ROOT/memory/store.json" <<'EOF'
{
  "project_context": [],
  "preferences": [],
  "decisions": [],
  "tasks": []
}
EOF

cat > "$ROOT/dreams/README.md" <<'EOF'
# Dreams

The dreams module stores future ideas, experiments, backlog items, and self-improvement loops.

Dreams are not executed automatically. They are reviewed and converted into tasks only after approval.
EOF

cat > "$ROOT/dreams/dreams.yml" <<'EOF'
dreams:
  backlog:
    - id: dream-001
      title: Business Model Canvas Generator
      description: Generate a complete BMC from a raw business idea.
      status: proposed
      convert_to_task: false

    - id: dream-002
      title: GitHub Issue Factory
      description: Convert roadmaps and specs into labeled GitHub issues.
      status: proposed
      convert_to_task: false

    - id: dream-003
      title: OpenClaw Agent Graph Builder
      description: Turn agent workflow specs into OpenClaw-compatible execution graphs.
      status: proposed
      convert_to_task: false

    - id: dream-004
      title: Dashboard Health Console
      description: Show heartbeat, task progress, memory health, and integration status.
      status: proposed
      convert_to_task: false

  review_cycle:
    cadence: weekly
    approval_required: true
    reviewer: user_or_workspace_admin
EOF

cat > "$ROOT/boot/README.md" <<'EOF'
# Boot

The boot module defines Luzia's startup sequence.

The boot sequence loads configuration in this order:

1. Manifest
2. Soul
3. Identity
4. Agents
5. User profile
6. Tool registry
7. Memory schema
8. Heartbeat
9. Dreams
EOF

cat > "$ROOT/boot/boot_sequence.py" <<'EOF'
from __future__ import annotations

import json
from pathlib import Path
from typing import Dict

ROOT = Path(__file__).resolve().parents[1]

FILES = {
    "manifest": ROOT / "agent.manifest.yml",
    "soul": ROOT / "soul" / "soul.yml",
    "identity": ROOT / "identity" / "identity.yml",
    "agents": ROOT / "agents" / "registry.yml",
    "user": ROOT / "user" / "user_profile.yml",
    "tools": ROOT / "tools" / "registry.yml",
    "memory": ROOT / "memory" / "memory_schema.yml",
    "dreams": ROOT / "dreams" / "dreams.yml",
}


def read_text_file(path: Path) -> str:
    if not path.exists():
        raise FileNotFoundError(f"Missing required boot file: {path}")
    return path.read_text(encoding="utf-8")


def boot() -> Dict[str, str]:
    loaded = {}
    for name, path in FILES.items():
        loaded[name] = read_text_file(path)
    return loaded


def summarize_boot(loaded: Dict[str, str]) -> dict:
    return {
        "agent": "Luzia",
        "status": "booted",
        "loaded_modules": list(loaded.keys()),
        "module_count": len(loaded),
        "next_recommended_command": "python3 heartbeat/heartbeat.py",
    }


if __name__ == "__main__":
    state = boot()
    print(json.dumps(summarize_boot(state), indent=2))
EOF

cat > "$ROOT/bootstrap/README.md" <<'EOF'
# Bootstrap

The bootstrap module initializes Luzia for first use.

It checks required files, creates local runtime folders, copies `.env.example` to `.env` when needed, and verifies the boot sequence.
EOF

cat > "$ROOT/bootstrap/bootstrap.sh" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

mkdir -p runtime logs data

if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi

python3 boot/boot_sequence.py
python3 heartbeat/heartbeat.py >/tmp/luzia_heartbeat_once.log 2>&1 &
PID=$!
sleep 1
kill "$PID" >/dev/null 2>&1 || true

echo "Luzia bootstrap complete."
echo "Next: edit .env, then run: python3 boot/boot_sequence.py"
EOF

chmod +x "$ROOT/bootstrap/bootstrap.sh"

cat > "$ROOT/bootstrap/bootstrap_checklist.md" <<'EOF'
# Bootstrap Checklist

- [ ] Copy `.env.example` to `.env`
- [ ] Add GitHub credentials if GitHub integration is needed
- [ ] Add OpenClaw credentials if OpenClaw integration is needed
- [ ] Add dashboard API credentials if dashboard publishing is needed
- [ ] Run `python3 boot/boot_sequence.py`
- [ ] Run `python3 heartbeat/heartbeat.py`
- [ ] Review `memory/memory_schema.yml`
- [ ] Review `tools/registry.yml`
- [ ] Convert approved dreams into GitHub issues
EOF

cat > "$ROOT/docs/business_model_canvas_template.md" <<'EOF'
# Business Model Canvas Template

## 1. Customer Segments

## 2. Value Propositions

## 3. Channels

## 4. Customer Relationships

## 5. Revenue Streams

## 6. Key Resources

## 7. Key Activities

## 8. Key Partnerships

## 9. Cost Structure
EOF

cat > "$ROOT/docs/github_issue_template.md" <<'EOF'
# GitHub Issue Template

## Title

## Context

## User Story
As a [user], I want [capability], so that [outcome].

## Acceptance Criteria
- [ ]
- [ ]
- [ ]

## Implementation Notes

## Labels

## Priority
EOF

cat > "$ROOT/examples/luzia_request_example.md" <<'EOF'
# Example Request

User asks:

> Luzia, turn my business idea into a Business Model Canvas and GitHub execution plan.

Luzia should produce:

1. Business Model Canvas
2. Assumptions
3. Risks
4. MVP scope
5. GitHub milestones
6. GitHub issues
7. Tool and integration plan
8. Dashboard metrics
EOF

cat > "$ROOT/.github/workflows/luzia-check.yml" <<'EOF'
name: Luzia Package Check

on:
  push:
  pull_request:

jobs:
  boot-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.x'
      - name: Run boot sequence
        run: python3 boot/boot_sequence.py
EOF

cat > "$ROOT/package.json" <<'EOF'
{
  "name": "luzia-agent-bodypack",
  "version": "0.1.0",
  "description": "A modular AI agent body package for Luzia, the AI Agent Government for PrimeOsHub.",
  "scripts": {
    "bootstrap": "bash bootstrap/bootstrap.sh",
    "boot": "python3 boot/boot_sequence.py",
    "heartbeat": "python3 heartbeat/heartbeat.py"
  },
  "keywords": [
    "ai-agent",
    "business-model-canvas",
    "github-workflows",
    "openclaw",
    "primeoshub",
    "luzia"
  ],
  "license": "MIT"
}
EOF

cat > "$ROOT/LICENSE" <<'EOF'
MIT License

Copyright (c) 2026 PrimeOsHub

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF

cat > "$ROOT/STRUCTURE.md" <<'EOF'
# Package Structure

```text
luzia-agent-bodypack/
├── README.md
├── LICENSE
├── package.json
├── agent.manifest.yml
├── .env.example
├── soul/
│   ├── README.md
│   └── soul.yml
├── identity/
│   ├── README.md
│   └── identity.yml
├── agents/
│   ├── README.md
│   ├── registry.yml
│   └── router.py
├── user/
│   ├── README.md
│   └── user_profile.yml
├── tools/
│   ├── README.md
│   ├── registry.yml
│   └── tool_contract.md
├── heartbeat/
│   ├── README.md
│   ├── heartbeat.py
│   └── status.json
├── memory/
│   ├── README.md
│   ├── memory_schema.yml
│   └── store.json
├── dreams/
│   ├── README.md
│   └── dreams.yml
├── boot/
│   ├── README.md
│   └── boot_sequence.py
├── bootstrap/
│   ├── README.md
│   ├── bootstrap.sh
│   └── bootstrap_checklist.md
├── docs/
│   ├── business_model_canvas_template.md
│   └── github_issue_template.md
├── examples/
│   └── luzia_request_example.md
└── .github/
    └── workflows/
        └── luzia-check.yml
```
EOF

if command -v zip >/dev/null 2>&1; then
  rm -f "$ZIP_NAME"
  zip -r "$ZIP_NAME" "$ROOT" >/dev/null
  echo "Created package: $ZIP_NAME"
else
  echo "Package folder created: $ROOT"
  echo "zip command not found; skipping archive creation."
fi

echo "Done. Package root: $ROOT"
