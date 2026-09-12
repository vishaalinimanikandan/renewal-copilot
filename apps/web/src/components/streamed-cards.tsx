import React from "react";

// Tool arguments arrive incrementally, before schema defaults are applied.
export interface RiskCardProps {
  headline?: string;
  summary?: string;
  facts?: Array<{ label?: string; value?: string } | null> | null;
  nextSteps?: Array<string | null> | null;
  tone?: string;
}

export interface TimelineProps {
  title?: string;
  columns?: Array<string | null> | null;
  rows?: Array<Array<string | null> | null> | null;
}

const toneColor = { neutral: "var(--muted)", good: "#2e7d5b", attention: "var(--accent)" } as const;

export function RiskCard({ headline, summary, facts, nextSteps, tone }: RiskCardProps) {
  const color = tone === "good" || tone === "attention" ? toneColor[tone] : toneColor.neutral;
  const safeFacts = Array.isArray(facts) ? facts : [];
  const safeNextSteps = Array.isArray(nextSteps) ? nextSteps : [];
  return (
    <article className="ck-card" style={{ borderLeftColor: color }}>
      <h3>{headline || "Preparing risk assessment…"}</h3>
      <p>{summary || "Gathering account details…"}</p>
      {!!safeFacts.length && (
        <dl className="ck-facts">
          {safeFacts.map((fact, index) => (
            <div key={index}>
              <dt>{fact?.label || "Loading…"}</dt>
              <dd>{fact?.value || "Loading…"}</dd>
            </div>
          ))}
        </dl>
      )}
      {!!safeNextSteps.length && (
        <ul className="ck-steps">
          {safeNextSteps.map((step, index) => (
            <li key={index}>{step || "Loading…"}</li>
          ))}
        </ul>
      )}
    </article>
  );
}

export function Timeline({ title, columns, rows }: TimelineProps) {
  // Tool arguments can arrive as a partial string fragment mid-stream, before
  // the full array is assembled — Array.isArray guards against treating that
  // fragment as ready to .map() over (a bare `.length` check is not enough,
  // since a string also has a truthy `.length`).
  const safeColumns = Array.isArray(columns) ? columns : [];
  const safeRows = Array.isArray(rows) ? rows : [];
  return (
    <article className="ck-card">
      {title && <h3>{title}</h3>}
      {!safeColumns.length ? (
        <p>Preparing timeline…</p>
      ) : (
        <div className="ck-scroll">
          <table>
            <thead>
              <tr>
                {safeColumns.map((header, index) => (
                  <th key={index}>{header || "Loading…"}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!safeRows.length ? (
                <tr><td colSpan={safeColumns.length}>Loading events…</td></tr>
              ) : safeRows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {safeColumns.map((_, cellIndex) => (
                    <td key={cellIndex}>{Array.isArray(row) ? (row[cellIndex] ?? "Loading…") : "Loading…"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </article>
  );
}
