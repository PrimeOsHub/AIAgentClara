# Omnichannel Strategy for OpenClaw Agents

Date: 2026-05-30

## Definition

Omnichannel is a business strategy that integrates all sales, marketing, and customer service channels into a single, synchronized system to provide a seamless customer experience.

Whether a customer starts on a mobile device, continues on a desktop computer, sends a WhatsApp message, interacts on Instagram, reads Google Business information, or visits a physical storefront, the interaction should feel continuous, informed, and unified.

For OpenClaw, omnichannel means Clara, Luzia, Codex, and future agents should share one operating truth: channel history, customer context, safety rules, handoff state, and business policy should not fracture by channel.

## Core Differences Between Strategies

| Strategy | How channels behave | Customer experience | Business risk |
| --- | --- | --- | --- |
| Single-channel | One primary channel only | Simple but limited | Misses customers who prefer other channels |
| Multi-channel | Several channels exist independently | Customer can choose a channel, but context may be repeated | Duplicated work, inconsistent tone, fragmented records |
| Cross-channel | Channels can pass some context between them | Customer can move between channels with partial continuity | Handoffs may still be manual or incomplete |
| Omnichannel | All channels share synchronized context, rules, and state | Customer experiences one continuous relationship | Requires stronger governance, integrations, and data discipline |

## Prime Odontologia Example

For Clara, omnichannel does not mean replying everywhere with the same exact text. It means the same patient relationship survives across channels.

Example journey:

1. A lead asks about Invisalign on Instagram.
2. Clara responds in a lighter Instagram tone and invites the person to continue on WhatsApp.
3. On WhatsApp, Clara already knows the interest is Invisalign and asks only the missing scheduling details.
4. The patient confirms a time.
5. The system records name, motive, preferred period, selected time, and confirmation.
6. After confirmation, Clara sends address, parking, punctuality, and arrival guidance.
7. If the person later checks Google Business or calls the clinic, the team can see the same appointment context.

The patient should not need to repeat the whole story at every step.

## OpenClaw Agent Roles

- Clara: patient-facing relationship and intake agent for WhatsApp, Instagram, and Google-style communication.
- Luzia: governance agent that defines channel policy, safety rules, routing, and dashboard visibility.
- Codex: implementation agent that wires registry files, tests, docs, and future integrations.
- Human owner: approves external sending, clinical judgement, scheduling authority, pricing changes, and high-risk exceptions.

## Required Shared Context

An omnichannel OpenClaw system should keep these fields synchronized:

- Customer or patient identity.
- Channel source and conversation history.
- Current intent: scheduling, cleaning, Invisalign, pain, price, location, follow-up, or other.
- Collected scheduling data: full name, main reason, preferred period, offered time, confirmation.
- Safety flags: pain, swelling, bleeding, trauma, diagnosis request, treatment price request.
- Last agent action and next expected action.
- Human handoff status.
- Consent and privacy boundaries.

## Channel Behavior

### WhatsApp

- Short, warm, direct messages.
- Best channel for scheduling flow and confirmation.
- Clara should ask one clear next question at a time.

### Instagram

- Lighter, social, and curiosity-oriented.
- Good for initial interest and moving qualified leads to WhatsApp.
- Avoid long clinical explanations in DMs.

### Google Business

- Clear, public-safe, professional language.
- Good for trust, location, parking, business hours, and general service information.
- Do not expose private patient information in public replies.

### Physical Clinic

- Staff should see the same basic intake context.
- In-person evaluation remains the source of truth for clinical diagnosis and treatment planning.

## Governance Rules

- One patient record should be the operational source of truth, even if messages arrive from several channels.
- Channel-specific tone can change, but medical safety rules cannot.
- Clara must not diagnose by message on any channel.
- Treatment prices beyond the initial consultation should wait for in-person evaluation.
- Luzia should track whether each channel is configured, tested, and safe.
- Codex should keep secrets, device tokens, logs, and local runtime files out of tracked docs.

## Control Panel Requirements

The OpenClaw control panel should eventually show:

- Active channels per agent.
- Last known customer intent.
- Handoff status.
- Missing scheduling fields.
- Safety flags.
- Prompt/config version used by each agent.
- Channel health and integration status.
- Audit trail of agent routing decisions.

## Migration Path

1. Document the omnichannel strategy and channel rules.
2. Keep Clara's WhatsApp behavior as the first production-quality channel.
3. Add Instagram and Google templates using the same safety policy.
4. Add a shared lead/patient state schema.
5. Add channel adapters that read/write the same state.
6. Add Luzia governance checks to the control panel.
7. Add tests for continuity, safety, routing, and handoff behavior.

## Validation Checklist

- [ ] A lead can move from Instagram to WhatsApp without losing intent.
- [ ] Clara asks only for missing scheduling details.
- [ ] Safety policy is identical across WhatsApp, Instagram, and Google.
- [ ] Public channels never expose private patient context.
- [ ] Human approval is required before real appointment booking if no scheduling integration exists.
- [ ] Luzia dashboard shows channel readiness and governance state.
- [ ] Codex tests cover channel routing and shared state contracts.
