# Demo video script — Renewal Copilot

Target: 2 minutes. Record the actual browser at `http://127.0.0.1:3100` with
your voice over it — do not use slides. Practice once before recording;
timing below is a guide, not a strict cue sheet.

**Before recording:** confirm the full live flow works once end to end
(OpenRouter responding, Ambiguous saving, refresh reading it back) so you
are not debugging on camera. Close any tabs/notifications that could leak a
key. Have both accounts' state settled (nothing mid-proposal) before you hit
record.

---

## 0:00–0:15 — Set the scene (Core Functionality + Theme Alignment)

Show the dashboard with **Northwind Freight** selected, before typing
anything.

> "This is a customer success dashboard. I'm looking at Northwind Freight —
> an enterprise account renewing in a few weeks. Notice the assistant on the
> right isn't a separate chatbot I have to explain things to — it already
> sees everything on this screen."

## 0:15–0:40 — Prove it uses page context, not guesswork (Innovation)

Type: **"Should I be worried about this account?"**

While it responds, narrate:

> "I didn't tell it the company name, the ARR, or the support tickets — it's
> reading the same account data I'm looking at. It's also pulling in real
> industry context through Exa, not just guessing."

Let it finish — ideally it renders a risk card, not just prose.

## 0:40–0:55 — Prove it's not just always saying "yes, risky" (Innovation, the strongest point)

Switch to **Bluefield Analytics** (healthy) and ask the same question.

> "Same question, different account — healthy this time. It doesn't
> manufacture urgency just because I asked. That's the difference between an
> agent reasoning about context and an agent performing concern on demand."

## 0:55–1:25 — The approval boundary and the real save (Usefulness + Technical Execution)

Back on Northwind Freight, type: **"Propose a follow-up."**

> "It drafts a task, but it can't save anything on its own — it's proposing,
> not writing. I have to click approve myself."

Click **Approve & save to Ambiguous**. Show the returned record ID/link.

> "That's now a real task in Ambiguous, not something the chat just claims
> to have done."

## 1:25–1:45 — Prove persistence (Core Functionality — the "not evidence" line)

**Refresh the whole browser tab.** Point at the follow-ups panel still
showing the saved task.

> "Reloading the page — the task is still here, because it's reading it back
> from Ambiguous itself, not from anything cached in the browser."

Optionally click **Decline** on a fresh proposal to show that path too, in
one sentence: *"And if I decline instead, nothing gets written at all."*

## 1:45–2:00 — Close

> "Renewal Copilot: OpenRouter for reasoning, Exa for grounding it in real
> market context, Ambiguous for the actual saved record, and CopilotKit
> tying the agent into the page a CSM already has open — not a chat window
> bolted on the side."

---

## Checklist before you hit publish

- [ ] Full flow ran live at least once immediately before recording (not "it worked yesterday")
- [ ] No API keys visible on screen (check browser dev tools aren't open, no `.env` tab)
- [ ] Both the "at risk" and "healthy" accounts shown, to make the contrast argument
- [ ] The actual Approve click and the actual returned record ID are visible, not just claimed in voiceover
- [ ] A full-page refresh is shown on camera, not just a "refresh from Ambiguous" button click
- [ ] Under the platform's time limit; audio is audible
