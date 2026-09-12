import assert from "node:assert/strict";
import test from "node:test";
import { findAccount, workspaceContext } from "./accounts";
import type { WorkplaceTask } from "./followup-types";

test("selection changes the shared account and activity log together", () => {
  const atRisk = workspaceContext("ACC-501", []);
  const healthy = workspaceContext("ACC-502", []);
  assert.equal(atRisk.selectedAccount.healthStatus, "At risk");
  assert.equal(healthy.selectedAccount.healthStatus, "Healthy");
  assert.match(healthy.selectedAccount.activity[0].detail, /business review/);
  assert.equal(healthy.availableAccounts.length, 2);
});

test("workspace context labels sample accounts and provider follow-ups", () => {
  const tasks: WorkplaceTask[] = [
    {
      id: "11111111-1111-4111-8111-111111111111",
      title: "Schedule renewal call",
      description: "Provider task details\nagents-everywhere:ACC-501",
      url: null,
    },
  ];
  const context = workspaceContext("ACC-501", tasks);
  assert.throws(() => findAccount("unknown"), /Unknown account/);
  assert.match(context.dataSource, /Fictional sample/);
  assert.match(context.dataSource, /Ambiguous/);
  assert.deepEqual(context.followups, tasks);
});
