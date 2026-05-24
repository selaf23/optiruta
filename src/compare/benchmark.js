import { nearestNeighbor } from "../algorithms/greedy.js";
import { backtrackingRoute } from "../algorithms/backtracking.js";
import { knapsack } from "../algorithms/knapsack.js";
import { sortByProximity } from "../algorithms/sorter.js";
import { buildDistanceMatrix } from "../core/distance.js";

export function runBenchmark(instance) {
  const { clients, depot, vehicleCapacity, distanceMatrix } = instance;
  const n = clients.length;

  const clientMap = new Map(clients.map(c => [c.id, c]));

  const sortedClients = sortByProximity(clients, depot);

  const greedyStart = performance.now();
  const greedyRoute = nearestNeighbor(distanceMatrix, n);
  const greedyTime = performance.now() - greedyStart;

  const greedyResult = {
    name: "Voraz (NN)",
    route: greedyRoute,
    distance: Math.round(greedyRoute.totalDistance * 100) / 100,
    timeMs: Math.round(greedyTime * 100) / 100,
    optimal: false,
  };

  const knapsackResult = knapsack(clients, vehicleCapacity);

  const btSelectedClients = knapsackResult.selectedIds
    .map(id => clientMap.get(id))
    .filter(Boolean);

  let btResult = null;
  let btTimeout = false;
  let btSkipped = false;

  if (btSelectedClients.length < 2) {
    btSkipped = true;
  } else {
    const subDistMatrix = buildDistanceMatrix(depot, btSelectedClients);
    const subN = btSelectedClients.length;
    const demands = [0, ...btSelectedClients.map(c => c.demand)];

    const subGreedyRoute = nearestNeighbor(subDistMatrix, subN);

    const btStart = performance.now();
    const btRaw = backtrackingRoute(
      subDistMatrix,
      demands,
      vehicleCapacity,
      subN,
      subGreedyRoute.totalDistance
    );
    const btTime = performance.now() - btStart;

    if (btRaw.found) {
      btResult = {
        name: "Backtracking",
        route: btRaw.route,
        distance: Math.round(btRaw.route.totalDistance * 100) / 100,
        timeMs: Math.round(btTime * 100) / 100,
        nodesExplored: btRaw.nodesExplored,
        prunesCount: btRaw.prunesCount,
        optimal: true,
      };
    } else if (btRaw.nodesExplored > 10_000_000) {
      btTimeout = true;
    }
  }

  return { greedyResult, btResult, knapsackResult, sortedClients, btTimeout, btSkipped, btSelectedClients };
}
