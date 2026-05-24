import { DEPOT, generateClients } from "./core/generator.js";
import { buildDistanceMatrix } from "./core/distance.js";
import { runBenchmark } from "./compare/benchmark.js";
import { drawScene } from "./ui/renderer.js";
import { renderResultsTable } from "./ui/results.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const clientSlider = document.getElementById("clientCount");
const clientDisplay = document.getElementById("clientCountDisplay");
const capacitySlider = document.getElementById("capacity");
const capacityDisplay = document.getElementById("capacityDisplay");
const runBtn = document.getElementById("runBtn");
const statusEl = document.getElementById("status");
const resultsBody = document.getElementById("resultsBody");

let currentInstance = null;

function setupControls() {
  clientSlider.addEventListener("input", () => {
    clientDisplay.textContent = clientSlider.value;
    regenerateAndDraw();
  });
  capacitySlider.addEventListener("input", () => {
    capacityDisplay.textContent = capacitySlider.value;
  });
  runBtn.addEventListener("click", runSimulation);
}

function generateInstance() {
  const n = parseInt(clientSlider.value);
  const cap = parseInt(capacitySlider.value);
  const clients = generateClients(n);
  const distanceMatrix = buildDistanceMatrix(DEPOT, clients);
  return { clients, depot: DEPOT, vehicleCapacity: cap, distanceMatrix };
}

function regenerateAndDraw() {
  currentInstance = generateInstance();
  drawScene(ctx, currentInstance.depot, currentInstance.clients);
  resultsBody.innerHTML = `<p style="color:#64748b;font-size:0.8rem;text-align:center;padding:1rem 0;">Ajusta capacidad y presiona ▶ Ejecutar</p>`;
  statusEl.textContent = `✅ ${currentInstance.clients.length} clientes`;
}

function runSimulation() {
  if (!currentInstance) currentInstance = generateInstance();

  runBtn.disabled = true;
  statusEl.textContent = "⏳ Ejecutando...";

  setTimeout(() => {
    if (!currentInstance) return;

    const { greedyResult, btResult, knapsackResult, btTimeout, btSkipped, btSelectedClients } =
      runBenchmark(currentInstance);

    const knapsackSelected = new Set(knapsackResult.selectedIds);

    drawScene(
      ctx,
      currentInstance.depot,
      currentInstance.clients,
      greedyResult.route,
      btResult?.route ?? undefined,
      knapsackSelected,
      btSelectedClients
    );

    renderResultsTable(
      resultsBody,
      greedyResult,
      btResult,
      knapsackResult,
      btTimeout,
      btSkipped,
      currentInstance.vehicleCapacity
    );

    const btInfo = btResult
      ? `· BT: ${btResult.distance}u en ${btResult.timeMs}ms (${btResult.nodesExplored} nodos, ${btResult.prunesCount} podas)`
      : btSkipped
        ? "· BT: saltado (< 2 clientes en mochila)"
        : btTimeout
          ? "· BT: timeout"
          : "· BT: no factible";

    statusEl.textContent = `✅ Voraz: ${greedyResult.distance}u ${greedyResult.timeMs}ms ${btInfo}`;
    runBtn.disabled = false;
  }, 50);
}

function init() {
  setupControls();
  currentInstance = generateInstance();
  drawScene(ctx, currentInstance.depot, currentInstance.clients);
  statusEl.textContent = `✅ ${currentInstance.clients.length} clientes · Presiona ▶ Ejecutar`;
}

init();
