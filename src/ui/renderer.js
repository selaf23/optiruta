import { euclidean } from "../core/distance.js";

export function drawScene(
  ctx, depot, clients,
  greedyRoute, btRoute, knapsackSelected, btSelectedClients
) {
  const W = 600, H = 600;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, W, H);

  drawGrid(ctx, W, H);

  if (greedyRoute) {
    drawPath(ctx, greedyRoute.path, clients, depot, "#3b82f6", "Voraz (NN)");
  }

  if (btRoute && btSelectedClients && btSelectedClients.length > 0) {
    drawPath(ctx, btRoute.path, btSelectedClients, depot, "#22c55e", "Backtracking");
  }

  for (const c of clients) {
    const selected = knapsackSelected?.has(c.id);
    ctx.beginPath();
    ctx.arc(c.x, c.y, selected ? 8 : 5, 0, Math.PI * 2);
    ctx.fillStyle = selected ? "#166534" : "#334155";
    ctx.fill();
    ctx.strokeStyle = selected ? "#86efac" : "#64748b";
    ctx.lineWidth = selected ? 2.5 : 1;
    ctx.stroke();
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 11px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`${c.id}`, c.x, c.y - 14);
    ctx.fillStyle = selected ? "#86efac" : "#94a3b8";
    ctx.font = "10px system-ui";
    ctx.fillText(`(${c.demand})`, c.x, c.y + (selected ? 18 : 14));
    if (selected) {
      ctx.fillStyle = "#86efac";
      ctx.font = "9px system-ui";
      ctx.fillText(`✓`, c.x + 8, c.y - 18);
    }
  }

  ctx.beginPath();
  ctx.arc(depot.x, depot.y, 9, 0, Math.PI * 2);
  ctx.fillStyle = "#fbbf24";
  ctx.fill();
  ctx.strokeStyle = "#fef3c7";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#fff";
  ctx.font = "16px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("⭐", depot.x, depot.y + 28);

  ctx.fillStyle = "#64748b";
  ctx.font = "10px system-ui";
  ctx.textAlign = "left";
  ctx.fillText("⭐ Depósito  ○ Cliente (demanda)  🟢 Seleccionado por mochila", 12, H - 12);
}

function drawGrid(ctx, W, H) {
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 0.5;
  for (let x = 0; x <= W; x += 60) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y <= H; y += 60) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
}

function drawPath(ctx, path, clients, depot, color, label) {
  const all = [depot, ...clients];
  if (path.length < 2) return;

  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.setLineDash(label === "Backtracking" ? [] : [6, 4]);
  ctx.moveTo(all[path[0]].x, all[path[0]].y);
  for (let i = 1; i < path.length; i++) {
    ctx.lineTo(all[path[i]].x, all[path[i]].y);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  const mid = Math.floor(path.length / 2);
  if (mid < all.length) {
    const midP = all[path[mid]];
    ctx.fillStyle = color;
    ctx.font = "bold 11px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(label, midP.x, midP.y - 22);
  }

  for (let i = 0; i < path.length - 1; i++) {
    if (path[i] >= all.length || path[i + 1] >= all.length) continue;
    const a = all[path[i]], b = all[path[i + 1]];
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    ctx.fillStyle = color;
    ctx.font = "9px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`${Math.round(euclidean(a, b))}`, mx, my - 6);
  }
}
