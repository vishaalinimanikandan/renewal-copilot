# Renewal Copilot

**OpenRouter (or OpenAI) + CopilotKit React + Ambiguous AI + Exa**

Built for the *Agents, Everywhere* hackathon, on top of CopilotKit's web
starter template. A renewal-risk agent that lives inside a customer success
dashboard instead of a separate chat window: it reads the exact account a
CSM already has open (usage trend, support tickets, renewal date), reasons
about churn risk using that page context, grounds the call in real industry
news via Exa, and — after an explicit human approval click — saves a real
follow-up task to Ambiguous AI that is still there after a refresh.


## What's inherited vs. what we built

This app started from CopilotKit's `apps/web` starter (the incident/on-call
demo). We kept its infrastructure — the CopilotKit wiring, the Ambiguous MCP
adapter with its idempotent, crash-safe write path, and the approval-boundary
security (origin checks, session cookies, schema validation) — and replaced
the domain on top of it:

| Kept (inherited infra) | Replaced (built for this event) |
| --- | --- |
| CopilotKit page-context + frontend-tool + generative-UI wiring | Sample data: `src/lib/accounts.ts` (customer accounts, not incidents) |
| Ambiguous MCP adapter, idempotency/dedup, session binding (`src/lib/server/`) | Domain prompt: `src/lib/prompt.ts` (renewal-risk reasoning, not on-call) |
| Approval UI shell (`workplace-followups.tsx`) | Renamed/re-scoped tools: `select_account`, `propose_followup`, `retrieve_followup`, `refresh_followups` |
| — | New capability: `research_account` — grounds risk calls in real Exa search results about the account's *industry*, since the sample accounts themselves are fictional |
| — | Dashboard UI (`page.tsx`), risk card copy (`streamed-cards.tsx`), account-picker layout |

## Get started

Complete the [root clone/install steps](../../README.md#get-started). Configure `.env`:

```dotenv
MODEL_PROVIDER=openrouter
OPENROUTER_API_KEY=your-key
MODEL=anthropic/claude-fable-5.1

AMBIGUOUS_API_KEY=your-workspace-key
EXA_API_KEY=your-key
```

Any current OpenRouter catalog model with tool support works — check
https://openrouter.ai/models if the one above is unavailable. OpenAI works
too (`MODEL_PROVIDER=openai`, `OPENAI_API_KEY`, `MODEL=<your model>`).

If your provider account is short on credit, `MAX_OUTPUT_TOKENS` in `.env`
caps how many tokens are requested per response — remove it once you have
normal credit.

```bash
npm run dev:web
```

Open `http://127.0.0.1:3100` and select an account.

## Try the flow

1. With **Northwind Freight** (at risk) selected, ask: *"Should I be worried about this account?"*
2. Watch it read the page context and, if it decides to, call `research_account` for real industry context (not the fictional company name — see `src/lib/prompt.ts` for why)
3. Ask: *"Propose a follow-up."* Review the exact proposed task.
4. Click **Approve & save to Ambiguous** — the app returns the real record ID/link.
5. Refresh the browser. Click **Refresh from Ambiguous** — the same record comes back, not a duplicate.
6. Switch to **Bluefield Analytics** (healthy) and ask the same risk question — it should say the account is healthy, not manufacture urgency.
7. Repeat step 3-4 with **Decline** instead — confirm no task is created.

You can also test steps 3-5 **without the AI at all**, using the manual
title/details form under the follow-ups panel — useful for verifying the
Ambiguous connection independently of the model.

## Customize these files

| Piece | File |
| --- | --- |
| Sample accounts and the shared page-context builder | [src/lib/accounts.ts](src/lib/accounts.ts) |
| Agent's domain instructions | [src/lib/prompt.ts](src/lib/prompt.ts) |
| Context and frontend tools | [src/components/app-control.tsx](src/components/app-control.tsx): `select_account`, `research_account`, `propose_followup`, `retrieve_followup`, `refresh_followups` |
| Approval UI and provider reads | [src/components/workplace-followups.tsx](src/components/workplace-followups.tsx) and [src/lib/use-workplace.ts](src/lib/use-workplace.ts) |
| Server approval boundary | [src/app/api/followups/route.ts](src/app/api/followups/route.ts) and [src/lib/server/followups.ts](src/lib/server/followups.ts) |
| Ambiguous MCP adapter | [src/lib/server/workplace.ts](src/lib/server/workplace.ts) |
| Generative UI (risk card, timeline) | [src/components/generative-ui.tsx](src/components/generative-ui.tsx) and [src/components/streamed-cards.tsx](src/components/streamed-cards.tsx) |
| Agent endpoint | [src/app/api/copilotkit/[[...path]]/route.ts](src/app/api/copilotkit/[[...path]]/route.ts) |

The web chat never receives raw Ambiguous write tools. It can propose a task
and read/refresh existing records through frontend tools; the server writes
only after the user clicks **Approve & save to Ambiguous**.

## Verify and limits

```bash
npm run verify                    # typecheck + 34 offline tests, no credentials needed
npm run build --workspace web     # production build
```

Offline tests cover the approval boundary, idempotency, and error handling;
they do not make live provider calls. Try the real create/read/decline flow
with your own OpenRouter and Ambiguous credentials before recording a demo.

[CopilotKit docs](https://docs.copilotkit.ai/) · [Sponsor authentication and first calls](../../using-sponsor-tools.md)
