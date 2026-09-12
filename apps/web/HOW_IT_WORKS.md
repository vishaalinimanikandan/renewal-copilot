# How this app works (plain-English guide)

This doc exists so you can explain, run, and modify this project **without
needing me in the loop every time**. It assumes zero prior React/TypeScript
background and builds up from there.

---

## 1. The 30-second mental model

```
Your browser  <-->  Next.js server (this app)  <-->  OpenRouter (the LLM "brain")
                            |                  <-->  Exa (live web search)
                            |                  <-->  Ambiguous AI (real task storage)
```

- **Your browser** shows the dashboard (account list + chat).
- **The Next.js server** is the one program that ties everything together: it
  serves the web page, and also runs small "API routes" (little backend
  functions) that talk to the outside services.
- **OpenRouter** is where the actual AI model lives. We send it your chat
  message plus "here's the account you're looking at" and it sends back a
  reply (and sometimes "please call this tool" instructions).
- **Exa** is a search engine API — the agent can ask it "search the web for
  X" and get real, dated, linked results back.
- **Ambiguous AI** is a real task-management product (like a lightweight
  Asana). When you click "Approve & save", *this* is where the task
  physically gets written, so it still exists after you refresh the page.

Nothing is saved "in the chat" or "in the browser" — the browser is just a
window onto real data that lives in Ambiguous.

---

## 2. Reading the file types (the "tsx / arr" stuff)

| You'll see | What it actually is |
|---|---|
| `.ts` file | Plain **TypeScript** — JavaScript with type labels added. TypeScript is just JavaScript where you're allowed to say "this variable is always a string" etc., so mistakes get caught before you even run the code. |
| `.tsx` file | TypeScript **+ HTML-like markup** (called JSX). This is how React components are written — you write something like `<button>Save</button>` directly inside your code, and it becomes a real clickable button. Any file that draws something on screen is `.tsx`; any file that's just logic/data is `.ts`. |
| `.test.ts` file | An automated test. Not part of the app itself — runs separately to check the real code still behaves correctly. |
| `something[]` or `Array<...>` | This just means "a list of things", e.g. `string[]` = a list of text values, `Array<{ label: string }>` = a list of objects that each have a `label` field. That's all "arr" (array) syntax means when you see it. |
| `type` / `interface` | A description of the *shape* of some data — "an Account always has an `id`, a `name`, a `renewalDate`", etc. It's documentation the computer actually enforces. |
| `async function` / `await` | "This might take a moment (network call, database, etc.) — wait here for the answer before moving to the next line." |
| `export function Foo()` | Makes `Foo` usable from other files. `import { Foo } from "./somewhere"` is how another file pulls it in. |

You genuinely don't need to know more syntax than this to follow along below.

---

## 3. The big picture: what is CopilotKit doing?

CopilotKit is the toolkit that makes "an AI agent embedded in your app" possible.
It gives us four capabilities, each used in this project:

1. **Page context** (`useAgentContext`) — silently attaches "here's what's on
   screen right now" (the selected account) to every chat message, so you
   never have to explain it yourself.
2. **Frontend tools** (`useFrontendTool`) — lets the AI call real functions in
   your browser/server (switch account, search the web, propose a task).
3. **Generative UI** (`useComponent`) — lets the AI draw one of *your*
   pre-built React components (a risk card, a timeline) instead of just
   writing paragraphs of text.
4. **The chat box itself** (`<CopilotChat />`) — the actual input/output UI.

---

## 4. File-by-file tour

### `src/app/` — pages and API routes (Next.js)

| File | Plain-English job |
|---|---|
| `page.tsx` | **The dashboard you see.** Renders the account picker, the account detail panel, and the chat panel. This is the only "screen" in the app. |
| `layout.tsx` | The outer wrapper every page sits inside (loads fonts, global styles, and the CopilotKit provider). You rarely need to touch this. |
| `globals.css` | All the visual styling (colors, spacing, fonts) — plain CSS, no framework. |
| `api/copilotkit/[[...path]]/route.ts` | **The agent's brain endpoint.** When you send a chat message, it comes here first. This file creates the AI agent (which model, which system prompt, which tools) and hands the request to CopilotKit's runtime to actually talk to OpenRouter. |
| `api/followups/route.ts` | **The write boundary.** The *only* place in the whole app allowed to actually save/read/decline a task in Ambiguous. The chat itself is never given this power directly — it can only ask this endpoint, and only after your approval click. |
| `api/search/route.ts` | A tiny proxy: takes a search query, calls Exa (using the secret key that must never reach the browser), returns results. |
| `api/mobile-copilotkit/`, `api/realtime-token/`, `voice/page.tsx` | Leftover infrastructure from the starter kit's mobile app and voice demo — not part of our account-risk flow, safe to ignore. |

### `src/lib/` — data and shared logic (no visuals)

| File | Plain-English job |
|---|---|
| `accounts.ts` | **The sample data.** Two fake customer accounts (Northwind Freight = at risk, Bluefield Analytics = healthy) with made-up usage/support/renewal numbers. `findAccount(id)` looks one up; `workspaceContext(...)` bundles "the selected account + its saved follow-ups" into one object that gets attached to the chat as context. |
| `prompt.ts` | **The agent's instructions**, in plain English, sent to the model on every request. Explains its job (assess renewal risk), what tools exist, and the hard rule that approval only happens via the page button. |
| `followup-types.ts` | The *shape* of a task/proposal (what fields it has). Pure documentation, no logic. |
| `followup-client.ts` | A small helper the browser uses to talk to `/api/followups` (handles the login-free "session cookie" handshake automatically). |
| `use-workplace.ts` | A React "hook" — holds the current state of the follow-ups panel (loading? connected? here's the list; here's a pending proposal) and exposes functions like `propose()`, `approve()`, `deny()`, `refresh()` for the UI to call. |
| `server/workplace.ts` | **The actual connector to Ambiguous.** Speaks a protocol called MCP (Model Context Protocol) to `https://app.ambiguous.ai/mcp` using your `AMBIGUOUS_API_KEY`. Validates every response strictly (rejects unsafe links, wrong IDs, etc.) before trusting it. |
| `server/followups.ts` | **The safety logic around writes.** Makes sure: a proposal expires after 10 minutes, the same task can never be accidentally created twice (even if you double-click or the network hiccups), and a decision (approve/decline) can only be made once. This is the most "engineered" file in the project — it's solving "how do I write to an external system exactly once, safely." |
| `server/followup-http.ts` | Turns HTTP requests (GET/POST to `/api/followups`) into calls on `followups.ts`, plus security checks (only this app's own page origin may call it, cookies are locked down, etc.). |
| `server/followup-error.ts` | A small custom error type so "this is a safe message to show the user" is distinguishable from "this is a raw error that might contain a secret." |

### `src/components/` — the visual building blocks (all `.tsx`)

| File | Plain-English job |
|---|---|
| `app-control.tsx` | **Registers the agent's tools and context.** This is where `select_account`, `research_account`, `propose_followup`, `retrieve_followup`, `refresh_followups` are actually defined — i.e., what happens when the AI decides to call them. |
| `generative-ui.tsx` | **Registers the agent's drawing tools.** Tells CopilotKit "if the AI wants to show `account_card` or `timeline`, here's the React component to use and what data it needs." |
| `streamed-cards.tsx` | The actual card/table components (`RiskCard`, `Timeline`) — plain React, no AI-specific code. They're written to render sensibly even while data is still streaming in word-by-word. |
| `workplace-followups.tsx` | The visual panel showing saved tasks, the "Refresh from Ambiguous" button, and — when the AI has proposed something — the **Approve / Decline** buttons. |
| `providers.tsx` | Wraps the whole page in CopilotKit's React context provider (boilerplate — connects the frontend to `/api/copilotkit`). |

### `packages/agent-core/` — shared logic used by both this web app and the Slack app

| File | Plain-English job |
|---|---|
| `agent.ts` | The factory that builds one AI agent instance: which model, which instructions (prompt), how many tool-call "steps" it's allowed per turn, which external tool servers (MCP) it can reach. |
| `prompt.ts` | `SURFACE_RULES` — the *generic* instructions ("you live inside the page, be brief, ask before anything irreversible") shared by every surface. Our own `apps/web/src/lib/prompt.ts` combines this with our own account-risk instructions, so we never had to touch this shared file. |
| `model.ts` | Reads `MODEL_PROVIDER` / `MODEL` / the API key from `.env` and builds the actual connection object OpenRouter (or OpenAI) needs. |
| `capabilities/search.ts` | The real Exa API call (`searchWeb`). Returns a plain "not configured" message instead of crashing if `EXA_API_KEY` is missing. |
| `capabilities/workplace.ts` | Wires up the Ambiguous MCP connection for whichever surface needs it (used by Slack; our web app's own copy lives in `server/workplace.ts` for tighter control). |

---

## 5. Running it yourself

From the **repo root** (`E:\AI_hackathon\agents-everywhere-starter-kit`), one command:

```bash
npm run dev:web
```

First run compiles everything fresh and can take **30–60 seconds** — that's
normal, not stuck. When ready you'll see:

```
▲ Next.js ... (Turbopack)
- Local: http://127.0.0.1:3100
```

Open that URL in your browser. To stop the server, go back to that terminal
and press `Ctrl+C`. If you ever see "port 3100 already in use", it means a
previous copy is still running somewhere — close that terminal first.

You do **not** need to run anything else separately — one command runs the
whole app (page + chat + API routes together).

---

## 6. Why you can't "fake" the Ambiguous save

Without `AMBIGUOUS_API_KEY` set in `.env`, the follow-ups panel deliberately
shows **"Connect a workspace to save tasks"** instead of pretending to save
something locally. This is intentional, not a bug: the whole point of this
template is proving a *real* record exists after a refresh, so there is no
"local stand-in" task — that would defeat the entire demo.

To actually see a save happen, you need a real key:

1. Go to https://www.ambiguous.ai/ and set up (or get given) a demo workspace
   you control.
2. Follow its **Connect** instructions to generate an API key with task
   read/write permission.
3. Add to `.env`: `AMBIGUOUS_API_KEY=your-key-here`
4. Restart `npm run dev:web` (env files are only read on startup).
5. Sanity-check the key works *before* touching the UI:

   ```bash
   node --env-file=.env --input-type=module <<'JS'
   const response = await fetch('https://app.ambiguous.ai/api/users/me', {
     headers: { Authorization: `Bearer ${process.env.AMBIGUOUS_API_KEY}` },
   });
   if (!response.ok) throw new Error(`Ambiguous identity check failed: HTTP ${response.status}`);
   console.log(await response.json());
   JS
   ```

   If that prints your workspace identity, the key is good.
6. Reload the app — the panel should now say "Retrieved from Ambiguous as
   <you>" instead of "Connect a workspace."

Until then, everything *except* the final save step is fully testable: page
context, chat responses, risk reasoning, `research_account` web search, and
`propose_followup` drafting a proposal all work with zero Ambiguous
involvement.
