export function breakCycles(vertices, edges) {
  const ignoredEdges = new Set(); // clés "from->to"
  const ignoredDetails = [];      // pour affichage / debug

  const getActiveEdges = () => edges.filter(e => !ignoredEdges.has(`${e.from}->${e.to}`));

  // Recherche un cycle et retourne la liste des arcs qui le composent, ou null
  function findOneCycle() {
    const adj = {};
    vertices.forEach(v => { adj[v.id] = []; });
    getActiveEdges().forEach(e => adj[e.from].push(e));

    const visited = {};
    const inStack = {};
    const stackEdges = [];

    function dfs(node) {
      visited[node] = true;
      inStack[node] = true;

      for (const edge of adj[node]) {
        if (!visited[edge.to]) {
          stackEdges.push(edge);
          const cycle = dfs(edge.to);
          if (cycle) return cycle;
          stackEdges.pop();
        } else if (inStack[edge.to]) {
          // Cycle trouvé : on reconstruit la boucle depuis edge.to jusqu'ici + cet arc
          const startIndex = stackEdges.findIndex(e2 => e2.from === edge.to);
          const cycleEdges = startIndex >= 0
            ? [...stackEdges.slice(startIndex), edge]
            : [edge];
          return cycleEdges;
        }
      }

      inStack[node] = false;
      return null;
    }

    for (const v of vertices) {
      if (!visited[v.id]) {
        const cycle = dfs(v.id);
        if (cycle) return cycle;
      }
    }
    return null;
  }

  let cycle = findOneCycle();
  let safety = 0;

  while (cycle && safety < 1000) {
    // Trouver l'arc de valeur MINIMALE dans ce cycle précis
    let minEdge = cycle[0];
    for (const e of cycle) {
      if (e.value < minEdge.value) minEdge = e;
    }
    const key = `${minEdge.from}->${minEdge.to}`;
    ignoredEdges.add(key);
    ignoredDetails.push({ from: minEdge.from, to: minEdge.to, value: minEdge.value });

    cycle = findOneCycle();
    safety++;
  }

  return { ignoredEdges, ignoredDetails };
}