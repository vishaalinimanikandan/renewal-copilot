import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { RiskCard, Timeline } from "./streamed-cards";

test("risk card renders loading content before any arguments arrive", () => {
  const html = renderToStaticMarkup(createElement(RiskCard, {}));
  assert.match(html, /Preparing risk assessment/);
});

test("risk card preserves the headline while other fields are streaming", () => {
  const html = renderToStaticMarkup(createElement(RiskCard, { headline: "Checkout unavailable" }));
  assert.match(html, /Checkout unavailable/);
  assert.match(html, /Gathering account details/);
});

test("risk card tolerates partial arrays and nested entries", () => {
  const html = renderToStaticMarkup(createElement(RiskCard, {
    tone: "att",
    facts: [null, {}, { label: "Impact" }, { label: "Since", value: "10:00" }],
    nextSteps: [null, "Check deployment"],
  }));
  assert.match(html, /var\(--muted\)/);
  assert.match(html, /Impact/);
  assert.match(html, /10:00/);
  assert.match(html, /Check deployment/);
  assert.match(html, /Loading/);
});

test("timeline renders loading content for empty and title-only arguments", () => {
  assert.match(renderToStaticMarkup(createElement(Timeline, {})), /Preparing timeline/);
  const html = renderToStaticMarkup(createElement(Timeline, { title: "Account history" }));
  assert.match(html, /Account history/);
  assert.match(html, /Preparing timeline/);
  assert.match(renderToStaticMarkup(createElement(Timeline, { columns: ["Time"] })), /Loading events/);
  assert.match(renderToStaticMarkup(createElement(Timeline, { rows: [["10:00"]] })), /Preparing timeline/);
  assert.match(renderToStaticMarkup(createElement(Timeline, { columns: null, rows: null })), /Preparing timeline/);
});

test("timeline tolerates partially streamed columns, rows, and cells", () => {
  const html = renderToStaticMarkup(createElement(Timeline, {
    columns: ["Time", null],
    rows: [null, [], ["10:00"], ["10:05", null]],
  }));
  assert.match(html, /Time/);
  assert.match(html, /10:00/);
  assert.match(html, /10:05/);
  assert.match(html, /Loading/);
});

test("complete risk and timeline arguments render their content", () => {
  const card = renderToStaticMarkup(createElement(RiskCard, {
    headline: "Checkout restored", summary: "All customers can check out",
    facts: [{ label: "Errors", value: "0%" }], nextSteps: ["Monitor"], tone: "good",
  }));
  for (const text of ["Checkout restored", "All customers can check out", "Errors", "0%", "Monitor", "#2e7d5b"]) {
    assert.ok(card.includes(text));
  }
  assert.doesNotMatch(card, /Loading|Preparing|Gathering/);
  const timeline = renderToStaticMarkup(createElement(Timeline, {
    title: "Recovery", columns: ["Time", "Event"], rows: [["10:00", "Deployed"], ["10:10", "Recovered"]],
  }));
  for (const text of ["Recovery", "Time", "Event", "10:00", "Deployed", "10:10", "Recovered"]) {
    assert.ok(timeline.includes(text));
  }
  assert.doesNotMatch(timeline, /Loading|Preparing/);
});
