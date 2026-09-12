"use client";

/**
 * Generative UI, controlled tier.
 *
 * `useComponent` gives the agent a catalog of *your* React components and lets
 * it choose one and fill in the props. The interface stays on-brand and
 * pixel-perfect because you wrote it — the agent only decides what to show.
 *
 * Renderers receive streamed partial arguments before schema defaults apply.
 */
import { useComponent } from "@copilotkit/react-core/v2";
import { z } from "zod";

import { RiskCard, Timeline } from "./streamed-cards";

export function GenerativeUI() {
  useComponent({
    name: "account_card",
    description:
      "Draw the current renewal-risk state of the account as a card. Call this once you have read the context, and again when the picture changes.",
    parameters: z.object({
      headline: z.string().describe("The risk verdict, in under ten words."),
      summary: z.string().describe("Who is affected and why it matters for renewal."),
      facts: z.array(z.object({ label: z.string(), value: z.string() })).max(4).default([]),
      nextSteps: z.array(z.string()).max(3).default([]),
      tone: z.enum(["neutral", "good", "attention"]).default("neutral"),
    }),
    render: RiskCard,
  });

  useComponent({
    name: "timeline",
    description:
      "Draw an ordered timeline of what happened when. Call this when there are three or more events worth ordering.",
    parameters: z.object({
      title: z.string().optional(),
      columns: z.array(z.string()).min(1).max(4),
      rows: z.array(z.array(z.string())),
    }),
    render: Timeline,
  });

  // Hooks register into the chat stream, so this component renders nothing.
  return null;
}
