export function backtrackingRoute(
  dist, demands, capacity, n,
  initialBound = Infinity, maxNodes = 10_000_000
) {
  let bestDist = initialBound;
  let bestPath = null;
  let nodesExplored = 0;
  let prunesCount = 0;
  const visited = new Array(n + 1).fill(false);
  visited[0] = true;

  const candidates = [];
  for (let i = 0; i <= n; i++) {
    const order = [];
    for (let j = 1; j <= n; j++) {
      if (j !== i) order.push(j);
    }
    order.sort((a, b) => dist[i][a] - dist[i][b]);
    candidates[i] = order;
  }

  function dfs(current, depth, currDist, currWeight, path) {
    if (nodesExplored > maxNodes) return;
    nodesExplored++;

    if (currDist >= bestDist) {
      prunesCount++;
      return;
    }

    if (depth === n) {
      const total = currDist + dist[current][0];
      if (total < bestDist) {
        bestDist = total;
        bestPath = [...path, 0];
      }
      return;
    }

    for (const next of candidates[current]) {
      if (visited[next]) continue;
      if (currWeight + demands[next] > capacity) {
        prunesCount++;
        continue;
      }

      visited[next] = true;
      path.push(next);
      dfs(next, depth + 1, currDist + dist[current][next], currWeight + demands[next], path);
      path.pop();
      visited[next] = false;

      if (nodesExplored > maxNodes) return;
    }
  }

  dfs(0, 0, 0, 0, [0]);

  if (!bestPath) {
    return {
      route: { path: [0], totalDistance: 0, totalDemand: 0 },
      nodesExplored,
      prunesCount,
      found: false,
    };
  }

  return {
    route: { path: bestPath, totalDistance: bestDist, totalDemand: 0 },
    nodesExplored,
    prunesCount,
    found: true,
  };
}
