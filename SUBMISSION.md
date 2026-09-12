# Submission

## What we inherited

The [Agents, Everywhere starter kit](https://github.com/CopilotKit/agents-everywhere-starter-kit)'s `apps/web` template (CopilotKit's web starter, originally an on-call incident demo), plus its `packages/agent-core` shared package. Specifically inherited and left unmodified in behavior: the CopilotKit React wiring (page context, frontend tools, generative UI), the Ambiguous AI MCP adapter with its idempotent/crash-safe write path and schema validation (`src/lib/server/workplace.ts`, `followups.ts`), the approval-boundary security (origin/session checks in `followup-http.ts`), and the generic `SURFACE_RULES` half of the system prompt (`packages/agent-core/src/prompt.ts`) shared with the kit's Slack template.

## What we built during the hackathon

A complete new domain and interaction on top of that infrastructure: a **customer-success renewal-risk copilot**, replacing the starter's on-call incident demo entirely.

- `apps/web/src/lib/accounts.ts` — new fictional sample accounts (customer health, ARR, renewal date, usage/support signals, activity log) replacing the incident sample data
- `apps/web/src/lib/prompt.ts` — new domain prompt (`RENEWAL_ROLE`) for renewal-risk reasoning, written as its own file so the shared `agent-core` package — and the Slack template that depends on it — was never touched
- `apps/web/src/components/app-control.tsx` — renamed/re-scoped tools (`select_account`, `propose_followup`, `retrieve_followup`, `refresh_followups`) plus a new tool, `research_account`, which grounds a risk assessment in real Exa search results about the account's **industry** (the sample accounts are fictional, so it deliberately never searches the made-up company name itself)
- `apps/web/src/app/page.tsx`, `streamed-cards.tsx`, `generative-ui.tsx` — new dashboard UI, risk card, and copy for the renewal domain
- `apps/web/src/lib/server/followups.ts`, `followup-types.ts`, tests — field/type renames and new fixtures throughout to match the new domain, keeping the inherited idempotency/session-binding logic intact and fully tested (34 passing offline tests)

## Title and description

**Project title:** Renewal Copilot

**What you built**

A CopilotKit web agent embedded directly in a customer-success dashboard. It sees whichever customer account a CSM has selected — no re-explaining context — reasons about renewal/churn risk using that account's live page data, optionally grounds the call in real industry news via Exa, and can draft a follow-up task. That task is never saved by the chat itself: only an explicit human click ("Approve & save to Ambiguous") triggers a real write to Ambiguous AI, and the result — a real record ID that survives a full page refresh — is what proves the action actually happened, not just that the chat said it did.

**Who it is for**

A customer success manager (CSM) managing a portfolio of renewal accounts, who currently has to manually cross-reference usage dashboards, support tickets, and renewal dates to decide which accounts need attention before their contract comes up.

**Why the context matters**

Strip the dashboard away and this becomes a generic chatbot that has to be told the company name, its numbers, and its history on every question — exactly the re-explaining problem this challenge is about. Because the agent lives inside the page, it already has that context, and because we deliberately built in a healthy-account contrast case, it's demonstrably reasoning over that context rather than performing manufactured urgency on demand.

**Sponsor technologies used**

| Sponsor | Role | Visible contribution |
| --- | --- | --- |
| OpenRouter (model gateway; OpenAI also supported via env swap) | Reasoning | The model reads page context and decides which tools to call |
| CopilotKit | Agent/UI framework | Page context injection, frontend tools, human-in-the-loop approval UI, generative UI (risk card, timeline) |
| Exa | Grounding | `research_account` tool returns real, linked industry-context search results |
| Ambiguous AI | Persistence | The actual saved task record, read back live after a browser refresh, via MCP |

**Repository:** https://github.com/vishaalinimanikandan/renewal-copilot

**Video link:** https://youtu.be/6qFOe7l_jJY
