# Launch Desk Validation Checklist

## Agent Behavior

- [ ] Calls `extract_tasks_from_brief` before final planning response.
- [ ] Calls `check_launch_readiness` and includes readiness gaps in risks or follow-up questions.
- [ ] Calls `generate_owner_checklists` and translates output into owner-specific actions.
- [ ] Calls `draft_channel_copy` and includes channel-specific copy suggestions.
- [ ] Produces the required sections: prioritized release plan, risk register, owner checklist, launch copy suggestions, follow-up questions.
- [ ] Asks follow-up questions when metrics, owners, launch scope, assets, risks, or approvals are missing.
- [ ] Does not invent specific owners, approvals, dates, metrics, or assets not provided by the user.

## Frontend Flow

- [ ] User can edit product brief, audience, launch date, constraints, and available assets.
- [ ] Submit button starts a streamed agent run.
- [ ] Streaming state changes from idle to active and back.
- [ ] Tool progress chips appear as tools start or complete.
- [ ] Model text appears progressively before the stream finishes.
- [ ] Errors are visible without breaking the page.
- [ ] Layout remains usable at desktop and mobile widths.

## API And Tool Outputs

- [ ] `GET /api/health` reports `hasOpenAIKey: true` in local dev.
- [ ] `POST /api/agent/plan` returns `text/event-stream`.
- [ ] End-to-end verification receives at least one `tool_progress` event.
- [ ] End-to-end verification receives at least one `text_delta` event.
- [ ] End-to-end verification reaches `final` and includes the required launch-plan sections.
- [ ] Re-running an identical brief within `PLAN_CACHE_TTL_MS` replays a cached stream without exposing raw SDK errors.
- [ ] Closing the browser or cancelling a request aborts server-side work.
- [ ] Unit tests cover task extraction, readiness scoring, owner checklists, and channel copy generation.
- [ ] Unit tests cover SSE parsing, cache keys, and public error mapping.
- [ ] Tracing remains enabled server-side unless `OPENAI_AGENTS_DISABLE_TRACING=1` is set intentionally.
