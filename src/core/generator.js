let seedCounter = 0;

export function generateClients(count, seed) {
  seedCounter++;
  const s = seed ?? seedCounter;
  const clients = [];
  for (let i = 0; i < count; i++) {
    const r1 = pseudoRandom(s * (i + 1) * 31);
    const r2 = pseudoRandom(s * (i + 1) * 37);
    clients.push({
      id: i,
      x: Math.round(r1 * 480 + 60),
      y: Math.round(r2 * 480 + 60),
      demand: Math.floor(pseudoRandom(s * (i + 1) * 41) * 10 + 2),
      value: Math.floor(pseudoRandom(s * (i + 1) * 43) * 50 + 10),
    });
  }
  return clients;
}

export const DEPOT = {
  id: -1,
  x: 300,
  y: 300,
  demand: 0,
  value: 0,
};

function pseudoRandom(n) {
  const x = Math.sin(n * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}
