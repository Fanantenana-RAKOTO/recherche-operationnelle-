import { useEffect, useRef, useState, useCallback } from 'react';
import { findVertexAt, distanceToLine } from '../../utils/geometry';
import ContextMenu from './ContextMenu';
import { useTheme } from '../../context/ThemeContext';

const PATH_COLORS = ['#FF4B4B', '#1CB0F6', '#FFC800', '#CE82FF', '#58CC02', '#FF9600'];

function buildPathEdgeMap(paths = []) {
  const map = new Map();
  paths.forEach((path, pathIndex) => {
    for (let i = 0; i < path.length - 1; i++) {
      const key = `${path[i]}->${path[i + 1]}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(pathIndex);
    }
  });
  return map;
}

export default function GraphCanvas({
  vertices, edges, result,
  addVertex, removeVertex, renameVertex,
  addEdge, removeEdge, updateEdgeValue
}) {
  const { darkMode } = useTheme();
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [dragTarget, setDragTarget] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [awaitingArc, setAwaitingArc] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [menu, setMenu] = useState({ position: null, target: null });

  const ignoredEdgeKeys = new Set(
    (result?.ignoredDetails ?? []).map(e => `${e.from}->${e.to}`)
  );
  const pathEdgeMap = buildPathEdgeMap(result?.paths);
  const optimalVertexSet = new Set(result?.paths?.flat() ?? []);

  const colors = {
    canvasBg: darkMode ? '#1A1A2E' : '#FBFBFB',
    edgeDefault: darkMode ? '#4B4B4B' : '#DDDDDD',
    edgeIgnored: darkMode ? '#6A6A6A' : '#C4C4C4',
    vertexFill: darkMode ? '#2A2A3E' : '#F0F0F0',
    vertexStroke: darkMode ? '#4B72FF' : '#1CB0F6',
    vertexOptimalStroke: '#FFC800',
    text: darkMode ? '#FFFFFF' : '#3C3C3C',
    valueText: '#58CC02'
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    edges.forEach((edge) => {
      const from = vertices.find(v => v.id === edge.from);
      const to = vertices.find(v => v.id === edge.to);
      if (!from || !to) return;

      const key = `${edge.from}->${edge.to}`;
      const isIgnored = ignoredEdgeKeys.has(key);
      const pathIndexes = pathEdgeMap.get(key) ?? [];
      const isOpposite = edges.some(e => e.from === edge.to && e.to === edge.from);

      const drawSingleEdge = (color, width, dashed, curveOffsetMultiplier) => {
        let controlX, controlY;
        if (isOpposite) {
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;
          const perpX = (to.y - from.y) * 0.35;
          const perpY = (to.x - from.x) * -0.35;
          controlX = midX + perpX * curveOffsetMultiplier;
          controlY = midY + perpY * curveOffsetMultiplier;
        }

        ctx.beginPath();
        ctx.setLineDash(dashed ? [8, 6] : []);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        if (isOpposite) {
          ctx.moveTo(from.x, from.y);
          ctx.quadraticCurveTo(controlX, controlY, to.x, to.y);
        } else {
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        let arrowX, arrowY, angle, midX, midY;
        const t = 0.9;
        if (isOpposite) {
          arrowX = (1 - t) ** 2 * from.x + 2 * (1 - t) * t * controlX + t ** 2 * to.x;
          arrowY = (1 - t) ** 2 * from.y + 2 * (1 - t) * t * controlY + t ** 2 * to.y;
          const dx = 2 * ((1 - t) * (controlX - from.x) + t * (to.x - controlX));
          const dy = 2 * ((1 - t) * (controlY - from.y) + t * (to.y - controlY));
          angle = Math.atan2(dy, dx);
          midX = 0.25 * from.x + 0.5 * controlX + 0.25 * to.x;
          midY = 0.25 * from.y + 0.5 * controlY + 0.25 * to.y;
        } else {
          arrowX = from.x + (to.x - from.x) * t;
          arrowY = from.y + (to.y - from.y) * t;
          angle = Math.atan2(to.y - from.y, to.x - from.x);
          midX = (from.x + to.x) / 2;
          midY = (from.y + to.y) / 2;
        }

        const size = 13;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX - size * 0.55 * Math.sin(angle), arrowY + size * 0.55 * Math.cos(angle));
        ctx.lineTo(arrowX + size * 0.55 * Math.sin(angle), arrowY - size * 0.55 * Math.cos(angle));
        ctx.fill();

        ctx.font = "bold 13px 'Baloo 2', sans-serif";
        ctx.fillStyle = colors.text;
        ctx.fillText(edge.value, midX + 8, midY - 8);
      };

      if (pathIndexes.length > 0) {
        pathIndexes.forEach((pIdx, i) => {
          const offset = (i - (pathIndexes.length - 1) / 2) + 1;
          drawSingleEdge(PATH_COLORS[pIdx % PATH_COLORS.length], 4, false, offset);
        });
      } else {
        drawSingleEdge(isIgnored ? colors.edgeIgnored : colors.edgeDefault, isIgnored ? 2 : 2.5, isIgnored, 1);
      }
    });

    vertices.forEach(v => {
      const isOnOptimalPath = optimalVertexSet.has(v.id);
      ctx.beginPath();
      ctx.arc(v.x, v.y, 22, 0, 2 * Math.PI);
      ctx.fillStyle = colors.vertexFill;
      ctx.fill();
      ctx.strokeStyle = isOnOptimalPath ? colors.vertexOptimalStroke : colors.vertexStroke;
      ctx.lineWidth = isOnOptimalPath ? 4 : 3;
      ctx.stroke();

      ctx.font = "bold 16px 'Baloo 2', sans-serif";
      ctx.fillStyle = colors.text;
      ctx.textAlign = 'center';
      ctx.fillText(v.id, v.x, v.y + 5);
      ctx.textAlign = 'left';

      if (result?.values?.[v.id] !== undefined) {
        const val = result.values[v.id];
        const display = val === Infinity ? '+inf' : val === -Infinity ? '-inf' : Math.round(val * 100) / 100;
        ctx.font = "bold 11px monospace";
        ctx.fillStyle = colors.valueText;
        ctx.textAlign = 'center';
        ctx.fillText(`V=${display}`, v.x, v.y - 28);
        ctx.textAlign = 'left';
      }
    });

    if (awaitingArc) {
      const source = vertices.find(v => v.id === awaitingArc.sourceId);
      if (source) {
        ctx.beginPath();
        ctx.setLineDash([6, 6]);
        ctx.strokeStyle = colors.vertexOptimalStroke;
        ctx.lineWidth = 2;
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }, [vertices, edges, result, awaitingArc, mousePos, darkMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    ctxRef.current = canvas.getContext('2d');
    const resize = () => {
      const container = canvas.parentElement;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      draw();
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [draw]);

  useEffect(() => { draw(); }, [draw]);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const handleMouseDown = (e) => {
    const pos = getPos(e);
    const vertex = findVertexAt(vertices, pos.x, pos.y);

    if (e.button === 0 && vertex && !awaitingArc) {
      setDragTarget(vertex);
      setDragOffset({ x: pos.x - vertex.x, y: pos.y - vertex.y });
    } else if (e.button === 2) {
      e.preventDefault();
      if (vertex) {
        setMenu({ position: { x: e.clientX, y: e.clientY }, target: { type: 'vertex', id: vertex.id } });
        return;
      }
      let minDist = 10, edgeIndex = -1;
      edges.forEach((edge, idx) => {
        const from = vertices.find(v => v.id === edge.from);
        const to = vertices.find(v => v.id === edge.to);
        if (!from || !to) return;
        const dist = distanceToLine(pos.x, pos.y, from.x, from.y, to.x, to.y);
        if (dist < minDist) { minDist = dist; edgeIndex = idx; }
      });
      if (edgeIndex !== -1) {
        setMenu({ position: { x: e.clientX, y: e.clientY }, target: { type: 'edge', index: edgeIndex } });
      }
    }
  };

  const handleMouseMove = (e) => {
    const pos = getPos(e);
    setMousePos(pos);
    if (dragTarget) {
      dragTarget.x = pos.x - dragOffset.x;
      dragTarget.y = pos.y - dragOffset.y;
      draw();
    }
  };

  const handleMouseUp = () => setDragTarget(null);

  const handleClick = (e) => {
    if (!awaitingArc) return;
    const pos = getPos(e);
    const target = findVertexAt(vertices, pos.x, pos.y);
    if (target && target.id !== awaitingArc.sourceId) {
      const value = prompt("Valeur de l'arc :", "1");
      if (value !== null && !isNaN(parseFloat(value))) {
        addEdge(awaitingArc.sourceId, target.id, parseFloat(value));
      }
    }
    setAwaitingArc(null);
  };

  useEffect(() => {
    const closeMenu = () => setMenu({ position: null, target: null });
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  const handleMenuAction = (action, id) => {
    if (action === 'addArc') setAwaitingArc({ sourceId: id });
    else if (action === 'rename') {
      const newName = prompt('Nouveau nom :', id);
      if (newName?.trim()) renameVertex(id, newName.trim());
    } else if (action === 'delete' && typeof id === 'string') removeVertex(id);
    else if (action === 'edit') {
      const newVal = prompt('Nouvelle valeur :', edges[id].value);
      if (newVal !== null && !isNaN(parseFloat(newVal))) updateEdgeValue(id, parseFloat(newVal));
    } else if (action === 'delete') removeEdge(id);
    setMenu({ position: null, target: null });
  };

  return (
    <div className="graph-canvas-wrapper" style={{ background: colors.canvasBg }}>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        onContextMenu={(e) => e.preventDefault()}
      />
      <ContextMenu {...menu} onAction={handleMenuAction} onClose={() => setMenu({ position: null, target: null })} />
    </div>
  );
}