export function renderResultsTable(container, greedy, bt, knapsack, btTimeout, btSkipped, capacity) {
  const gap = bt ? ((greedy.distance - bt.distance) / bt.distance * 100).toFixed(1) : "—";

  let html = `<table>
    <thead><tr>
      <th>Algoritmo</th><th>Distancia</th><th>Tiempo</th><th>Nodos</th><th>Podas</th><th>Tipo</th>
    </tr></thead><tbody>`;

  html += row(greedy.name, greedy.distance, greedy.timeMs, "—", "—", "Heurística", "badge-heuristic");
  html += row("Mochila (DP)", "—", "—", "—", "—", "0/1 Knapsack", "badge-heuristic");

  if (bt) {
    html += row(bt.name, bt.distance, bt.timeMs, bt.nodesExplored, bt.prunesCount, "Óptimo", "badge-optimal");
  } else if (btSkipped) {
    html += `<tr><td colspan="6" style="color:#fbbf24;padding:0.5rem;">⚠️ Mochila seleccionó &lt;2 clientes — BT no aplica</td></tr>`;
  } else if (btTimeout) {
    html += `<tr><td colspan="6" style="color:#f87171;padding:0.5rem;">⏱️ Backtracking excedió el límite de nodos</td></tr>`;
  } else {
    html += `<tr><td colspan="6" style="color:#f87171;padding:0.5rem;">❌ No se encontró ruta factible</td></tr>`;
  }

  html += `</tbody></table><div style="margin-top:0.75rem;padding-top:0.75rem;border-top:1px solid #334155;">`;

  if (bt && gap !== "—") {
    const direction = greedy.distance > bt.distance ? "mejora" : "igualó";
    const pct = gap;
    html += `<p style="font-size:0.8rem;color:#94a3b8;">
      <span style="color:#86efac;">● Gap Voraz vs BT:</span>
      <strong style="color:#e2e8f0;">${pct}%</strong>
      — BT ${direction} la ruta
    </p>`;
  }

  const selectedStr = knapsack.selectedIds.length
    ? knapsack.selectedIds.join(", ")
    : "ninguno";
  html += `<p style="font-size:0.8rem;color:#94a3b8;margin-top:0.5rem;">
    📦 <strong style="color:#e2e8f0;">Mochila 0/1 (DP)</strong><br>
    <span style="font-size:0.75rem;color:#64748b;">
      Clientes: <strong style="color:#86efac;">[${selectedStr}]</strong>
      · Peso: ${knapsack.totalWeight}/${capacity} · Valor: ${knapsack.totalValue}
    </span>
  </p>`;

  html += `</div>`;
  container.innerHTML = html;
}

function row(name, dist, time, nodes, prunes, label, badgeClass) {
  return `<tr>
    <td style="text-align:left;font-weight:600;">${name}</td>
    <td>${dist}</td>
    <td>${time}</td>
    <td>${nodes}</td>
    <td>${prunes}</td>
    <td><span class="badge ${badgeClass}">${label}</span></td>
  </tr>`;
}
