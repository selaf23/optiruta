export function knapsack(clients, capacity) {
  const n = clients.length;
  if (n === 0 || capacity <= 0) {
    return { selectedIds: [], totalValue: 0, totalWeight: 0 };
  }

  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const w = clients[i - 1].demand;
    const v = clients[i - 1].value;
    for (let c = 0; c <= capacity; c++) {
      dp[i][c] = w <= c ? Math.max(dp[i - 1][c], dp[i - 1][c - w] + v) : dp[i - 1][c];
    }
  }

  const selected = [];
  let c = capacity;
  let totalWeight = 0;
  for (let i = n; i >= 1; i--) {
    if (dp[i][c] !== dp[i - 1][c]) {
      selected.push(clients[i - 1].id);
      totalWeight += clients[i - 1].demand;
      c -= clients[i - 1].demand;
    }
  }

  return { selectedIds: selected.reverse(), totalValue: dp[n][capacity], totalWeight };
}
