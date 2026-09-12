/** Sample account context. Follow-up tasks are retrieved separately from Ambiguous. */
import type { WorkplaceTask } from "./followup-types";

export const accounts = [
  {
    id: "ACC-501",
    name: "Northwind Freight",
    segment: "Enterprise",
    arr: "$84,000/yr",
    renewalDate: "2026-09-30",
    healthStatus: "At risk",
    csm: "Maya Chen",
    summary:
      "Product usage has dropped sharply since their new ops lead joined in July, and two support tickets escalated to engineering this week without a clear resolution yet.",
    signals:
      "Weekly active seats down 42% over the last 30 days. Two P1 support tickets in the last 7 days, both escalated. No response yet to the last two check-in emails.",
    activity: [
      {
        time: "2026-08-14",
        author: "Usage monitor",
        detail: "Weekly active seats fell below the 60% adoption threshold.",
      },
      {
        time: "2026-09-02",
        author: "Support",
        detail:
          "Ticket #4821 escalated to engineering: exports failing for the finance team.",
      },
      {
        time: "2026-09-08",
        author: "Maya Chen",
        detail:
          "Sent a check-in email to the account owner. No reply after 5 days.",
      },
    ],
  },
  {
    id: "ACC-502",
    name: "Bluefield Analytics",
    segment: "Mid-market",
    arr: "$26,400/yr",
    renewalDate: "2026-11-15",
    healthStatus: "Healthy",
    csm: "Alex Rivera",
    summary:
      "Usage has been steady and the champion is actively engaged. Renewal is not imminent and no risk signals have appeared this quarter.",
    signals:
      "Weekly active seats up 8% over the last 30 days. No open support tickets. Champion replied within a day to the last check-in.",
    activity: [
      {
        time: "2026-08-20",
        author: "Alex Rivera",
        detail: "Quarterly business review completed; champion is satisfied.",
      },
      {
        time: "2026-09-01",
        author: "Usage monitor",
        detail: "Adoption remains steady across all licensed seats.",
      },
    ],
  },
] as const;

export type Account = (typeof accounts)[number];

export function findAccount(id: string): Account {
  const account = accounts.find((item) => item.id === id);
  if (!account)
    throw new Error(
      `Unknown account ${id}. Choose ${accounts.map((item) => item.id).join(" or ")}.`,
    );
  return account;
}

export function workspaceContext(
  selectedId: string,
  followups: WorkplaceTask[],
) {
  return {
    dataSource:
      "Fictional sample accounts. Follow-ups shown here were retrieved from Ambiguous for the selected account. A proposal is not a saved task.",
    availableAccounts: accounts.map(({ id, name, healthStatus }) => ({
      id,
      name,
      healthStatus,
    })),
    selectedAccount: {
      ...findAccount(selectedId),
      activity: [...findAccount(selectedId).activity],
    },
    followups,
  };
}
