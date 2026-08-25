import { breakCycles } from './graphAnalysis';

const EPSILON = 1e-9;

export function bellmanKalaba({ vertices, edges, startId, endId, mode = 'max', maxIter = 200, maxPaths = 25 }) {
  const ids = vertices.map(v => v.id);
  const isMax = mode === 'max';
  const INF = isMax ? -Infinity : Infinity;

  const isBetter = (candidate, current) =>
    isMax ? candidate > current + EPSILON : candidate < current - EPSILON;
  const isEqual = (a, b) => Math.abs(a - b) <= EPSILON;

  // En maximisation : on casse chaque cycle en ignorant SEULEMENT son arc de valeur minimale
  let ignoredEdges = new Set();
  let ignoredDetails = [];
  if (isMax) {
    const result = breakCycles(vertices, edges);
    ignoredEdges = result.ignoredEdges;
    ignoredDetails = result.ignoredDetails;
  }
  const activeEdges = edges.filter(e => !ignoredEdges.has(`${e.from}->${e.to}`));

  const V = {};
  const preds = {};
  ids.forEach(id => {
    V[id] = id === endId ? 0 : INF;
    preds[id] = new Set();
  });

  const history = [{ iter: 0, values: { ...V } }];
  let changed = true;
  let iter = 0;

  while (changed && iter < maxIter) {
    changed = false;
    for (const edge of activeEdges) {
      const { from, to, value } = edge;
      if (V[to] === INF) continue;
      const candidate = V[to] + value;

      if (V[from] === INF || isBetter(candidate, V[from])) {
        V[from] = candidate;
        preds[from] = new Set([to]);
        changed = true;
      } else if (isEqual(candidate, V[from]) && !preds[from].has(to)) {
        preds[from].add(to);
        changed = true;
      }
    }
    iter++;
    history.push({ iter, values: { ...V } });
  }

  if (V[startId] === INF) {
    throw new Error(`Aucun chemin trouvé entre ${startId} et ${endId}.`);
  }

  const allPaths = [];
  const dfs = (node, path, visited) => {
    if (allPaths.length >= maxPaths) return;
    if (node === endId) { allPaths.push([...path, node]); return; }
    if (visited.has(node)) return;
    visited.add(node);
    for (const next of preds[node]) {
      dfs(next, [...path, node], visited);
      if (allPaths.length >= maxPaths) break;
    }
    visited.delete(node);
  };
  dfs(startId, [], new Set());

  return {
    value: V[startId],
    paths: allPaths.length ? allPaths : [[startId]],
    values: V,
    history,
    cycleDetected: ignoredEdges.size > 0,
    ignoredDetails, // ex: [{from:'B', to:'A', value:2}]
    truncated: allPaths.length >= maxPaths
  };
}