export function nearestNeighbor(dist, n) {
  const visited = new Set();
  const path = [0];
  let current = 0;
  let totalDistance = 0;
  visited.add(0);

  for (let step = 0; step < n; step++) {
    let nearest = -1;
    let minDist = Infinity;
    for (let j = 1; j <= n; j++) {
      if (!visited.has(j) && dist[current][j] < minDist) {
        minDist = dist[current][j];
        nearest = j;
      }
    }
    if (nearest === -1) break;
    path.push(nearest);
    totalDistance += minDist;
    visited.add(nearest);
    current = nearest;
  }

  totalDistance += dist[current][0];
  path.push(0);

  return { path, totalDistance, totalDemand: 0 };
}
