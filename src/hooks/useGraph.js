import { useState, useCallback } from 'react';
import { bellmanKalaba } from '../algorithms/bellmanKalaba';

export function useGraph() {
  const [vertices, setVertices] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [result, setResult] = useState(null);

  const addVertex = useCallback((x, y, customId = null) => {
    const id = customId ?? String(nextId);
    if (vertices.some(v => v.id === id)) return null;
    setNextId(prev => (customId ? Math.max(prev, (parseInt(id) || 0) + 1) : prev + 1));
    setVertices(prev => [...prev, { id, x, y }]);
    return id;
  }, [vertices, nextId]);

  const removeVertex = useCallback((id) => {
    setVertices(prev => prev.filter(v => v.id !== id));
    setEdges(prev => prev.filter(e => e.from !== id && e.to !== id));
  }, []);

  const renameVertex = useCallback((oldId, newId) => {
    if (oldId === newId || vertices.some(v => v.id === newId)) return false;
    setVertices(prev => prev.map(v => v.id === oldId ? { ...v, id: newId } : v));
    setEdges(prev => prev.map(e => ({
      from: e.from === oldId ? newId : e.from,
      to: e.to === oldId ? newId : e.to,
      value: e.value
    })));
    return true;
  }, [vertices]);

  const addEdge = useCallback((from, to, value) => {
    if (from === to || edges.some(e => e.from === from && e.to === to)) return false;
    setEdges(prev => [...prev, { from, to, value }]);
    return true;
  }, [edges]);

  const removeEdge = useCallback((index) => {
    setEdges(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateEdgeValue = useCallback((index, value) => {
    setEdges(prev => prev.map((e, i) => i === index ? { ...e, value } : e));
  }, []);

  const runCalculation = useCallback((startId, endId, mode) => {
    const res = bellmanKalaba({ vertices, edges, startId, endId, mode });
    setResult(res);
    return res;
  }, [vertices, edges]);

  const resetGraph = useCallback(() => {
    setVertices([]);
    setEdges([]);
    setNextId(1);
    setResult(null);
  }, []);

  return {
    vertices, edges, result,
    addVertex, removeVertex, renameVertex,
    addEdge, removeEdge, updateEdgeValue,
    runCalculation, resetGraph
  };
}