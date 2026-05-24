import { euclidean } from "../core/distance.js";

export function sortByProximity(clients, reference) {
  return clients
    .map(c => ({ c, d: euclidean(c, reference) }))
    .sort((a, b) => a.d - b.d)
    .map(({ c }) => c);
}
