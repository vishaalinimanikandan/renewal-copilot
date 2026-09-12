"use client";

import { useCallback, useState } from "react";
import {
  CopilotChat,
  useConfigureSuggestions,
} from "@copilotkit/react-core/v2";
import { GenerativeUI } from "@/components/generative-ui";
import { AppControl } from "@/components/app-control";
import { findAccount, accounts, workspaceContext } from "@/lib/accounts";
import { useWorkplace } from "@/lib/use-workplace";
import { WorkplaceFollowups } from "@/components/workplace-followups";

export default function Home() {
  const [selectedId, setSelectedId] = useState<string>(accounts[0].id);
  const workplace = useWorkplace(selectedId);
  const { selectedAccount: account } = workspaceContext(
    selectedId,
    workplace.status?.status === "connected" ? workplace.status.tasks : [],
  );
  const selectAccount = useCallback((id: string) => {
    setSelectedId(findAccount(id).id);
  }, []);

  useConfigureSuggestions(
    {
      suggestions: [
        {
          title: "Should I be worried about this account?",
          message:
            "Using the page context, assess this account's renewal risk. Should I be worried?",
        },
        {
          title: "Propose a follow-up",
          message:
            "Prepare one useful Ambiguous follow-up for this account's renewal. Show me the proposal before it is saved.",
        },
      ],
      available: "before-first-message",
    },
    [],
  );

  return (
    <>
      <GenerativeUI />
      <AppControl
        selectedId={selectedId}
        selectAccount={selectAccount}
        workplace={workplace}
      />
      <main className="ck-workspace">
        <header className="ck-workspace-header">
          <div>
            <p className="ck-eyebrow">Agents, everywhere · Web example</p>
            <h1>Renewal Copilot</h1>
            <p className="ck-intro">
              Pick an account. Ask your assistant. Review a follow-up.
            </p>
          </div>
          <span className="ck-tag">Sample data</span>
        </header>

        <div className="ck-workspace-grid">
          <section className="ck-panel" aria-labelledby="account-title">
            <div className="ck-account-picker">
              <label htmlFor="account-select">Account</label>
              <select
                id="account-select"
                value={selectedId}
                onChange={(event) => selectAccount(event.target.value)}
              >
                {accounts.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.id} · {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="ck-detail">
              <span className="ck-status-label">{account.healthStatus}</span>
              <h2 id="account-title">{account.name}</h2>
              <p>{account.summary}</p>
              <details className="ck-more" key={account.id}>
                <summary>Details &amp; activity</summary>
                <dl className="ck-detail-facts">
                  <div>
                    <dt>CSM</dt>
                    <dd>{account.csm}</dd>
                  </div>
                  <div>
                    <dt>Segment</dt>
                    <dd>{account.segment}</dd>
                  </div>
                  <div>
                    <dt>ARR</dt>
                    <dd>{account.arr}</dd>
                  </div>
                  <div>
                    <dt>Renewal date</dt>
                    <dd>{account.renewalDate}</dd>
                  </div>
                </dl>
                <h3>Risk signals</h3>
                <p>{account.signals}</p>
                <h3>Activity</h3>
                <ol className="ck-timeline">
                  {account.activity.map((event) => (
                    <li key={event.time}>
                      <time>{event.time}</time>
                      <div>
                        <strong>{event.author}</strong>
                        <p>{event.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </details>
            </div>

            <WorkplaceFollowups accountId={selectedId} workplace={workplace} />
          </section>

          <section
            className="ck-panel ck-assistant"
            aria-labelledby="assistant-title"
          >
            <header className="ck-assistant-header">
              <h2 id="assistant-title">Ask assistant</h2>
              <p>It can read this account and prepare renewal follow-ups.</p>
            </header>
            <CopilotChat
              className="ck-chat"
              labels={{
                welcomeMessageText: "Should I be worried about this account?",
                chatInputPlaceholder: "Ask about this account…",
              }}
            />
          </section>
        </div>
      </main>
    </>
  );
}
