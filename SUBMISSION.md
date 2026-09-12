# Submission checklist

Choose your city on the [global event page](https://aitinkerers.org/hackathons/global/agents-everywhere). Use that city's participant portal for the submission deadline and published judging criteria, and its handbook for eligibility and required deliverables. See [hackathon-rules.md](hackathon-rules.md) for the agent-readable summary.

## Build eligibility

- [x] Our submitted project is a net-new build created during the official hackathon period
- [x] Its core functionality was built during the event; we are not resubmitting or extending a pre-existing project and entering it as new
- [x] We identify inherited templates, libraries, prompts, components, and starter code separately from our event work

**What we inherited**

The [Agents, Everywhere starter kit](https://github.com/CopilotKit/agents-everywhere-starter-kit)'s `apps/web` template (CopilotKit's web starter, originally an on-call incident demo), plus its `packages/agent-core` shared package. Specifically inherited and left unmodified in behavior: the CopilotKit React wiring (page context, frontend tools, generative UI), the Ambiguous AI MCP adapter with its idempotent/crash-safe write path and schema validation (`src/lib/server/workplace.ts`, `followups.ts`), the approval-boundary security (origin/session checks in `followup-http.ts`), and the generic `SURFACE_RULES` half of the system prompt (`packages/agent-core/src/prompt.ts`) shared with the kit's Slack template.

**What we built during the hackathon**

A complete new domain and interaction on top of that infrastructure: a **customer-success renewal-risk copilot**, replacing the starter's on-call incident demo entirely.

- `apps/web/src/lib/accounts.ts` — new fictional sample accounts (customer health, ARR, renewal date, usage/support signals, activity log) replacing the incident sample data
- `apps/web/src/lib/prompt.ts` — new domain prompt (`RENEWAL_ROLE`) for renewal-risk reasoning, written as its own file so the shared `agent-core` package — and the Slack template that depends on it — was never touched
- `apps/web/src/components/app-control.tsx` — renamed/re-scoped tools (`select_account`, `propose_followup`, `retrieve_followup`, `refresh_followups`) plus a new tool, `research_account`, which grounds a risk assessment in real Exa search results about the account's **industry** (the sample accounts are fictional, so it deliberately never searches the made-up company name itself — see `apps/web/src/lib/prompt.ts`)
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

## Evidence for the judging criteria

Judges score each of the four official criteria from 1–5. This checklist helps you gather evidence; it does not guarantee a score. A working starter is a foundation for your own project.

| Official criterion | Show in your project and demo |
|---|---|
| Core Requirements & Functionality | Run one complete workflow in the intended environment, from user request through tools to a verified result. Repeat it with live integrations; offline tests alone do not prove the deployed flow. |
| Innovation & Theme Alignment | Show the surrounding context before the prompt and explain the original interaction it enables. Compare with the context removed: what value would a standalone chatbox lose? |
| Technical Execution & Integration | Show how tools, data, and the environment connect. Demonstrate a relevant failure or cancellation path and explain recovery, state persistence, and integration limits. |
| Usefulness & Agentic Experience | Identify the user and problem, show a meaningful action in the surface, and demonstrate clear feedback and appropriate user control. Explain what work the agent saves. |

- [ ] We can point to visible evidence for every criterion — **verify by running the [demo script](DEMO_SCRIPT.md) live before recording**
- [x] We distinguish live services, sample data, session-only state, and standalone recipes — see the inherited/built table above and `apps/web/README.md`
- [x] Sponsor technologies contribute to the workflow; their count is not a judging criterion

## Public repository

- [ ] A new participant can run the quickstart from a clean clone — **verify with a fresh `git clone` + `npm ci` before final submission**
- [x] The README lists the credentials and separate processes required (`apps/web/README.md`)
- [x] `npm run verify` passes (typecheck + 34 offline tests, confirmed during the event)
- [x] `.env`, tokens, generated traces with sensitive data, and account secrets are excluded (`.gitignore` covers `.env`; never commit real keys)
- [x] Sample data, session-only state, and unimplemented integrations are clearly labeled (the UI shows a "Sample data" tag and an explicit "Connect a workspace" state when Ambiguous is unconfigured)

## Two-minute demo video

Script: [DEMO_SCRIPT.md](DEMO_SCRIPT.md)

- [ ] Show the surface and existing context before the prompt
- [ ] Demonstrate one complete interaction
- [ ] Show a visible result: an actual record, local state change, or research source links
- [ ] If showing an approval, distinguish the decision from execution and demonstrate the resulting behavior
- [ ] State which sponsor technologies made the interaction possible
- [ ] Keep the video within the event's limit and check audio

**Video link:** _(add after recording and uploading)_

## Social post and final submission

- [ ] Follow the organizer's posting and sponsor-tagging instructions
- [ ] Link the public repository and video
- [ ] Credit the sponsors you used and applicable local partners
- [ ] Check the live integration once more before recording or submitting
- [ ] Inspect the repository, video and screenshots for secrets

**Draft social post:**

> Built Renewal Copilot for #AgentsEverywhere — a customer-success agent that lives inside the account dashboard a CSM already has open, reasons about renewal risk from real page context, grounds it in live industry research via @exa_ai, and saves a real follow-up task to @AmbiguousAI (not just a chat message claiming it did) — all through @CopilotKit, running on @OpenRouterAI. [repo link] [video link]

_(Adjust sponsor @handles/hashtags to your organizer's actual instructions before posting.)_

**Repository:** https://github.com/vishaalinimanikandan/renewal-copilot

Prepare the post and submission for a human to publish; running the starter kit
does not publish either automatically.
