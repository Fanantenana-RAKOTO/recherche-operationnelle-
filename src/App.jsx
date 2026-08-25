import { useCallback, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { useGraph } from './hooks/useGraph';
import { useResizable } from './hooks/useResizable';
import AppHeader from './components/layout/AppHeader';
import ControlPanel from './components/panels/ControlPanel';
import Toolbar from './components/panels/Toolbar';
import ResultsPanel from './components/panels/ResultsPanel';
import IterationTable from './components/panels/IterationTable';
import GraphCanvas from './components/graph/GraphCanvas';
import './styles/theme.css';
import './App.css';

function AppContent() {
  const {
    vertices, edges, result,
    addVertex, removeVertex, renameVertex,
    addEdge, removeEdge, updateEdgeValue,
    runCalculation, resetGraph
  } = useGraph();

  const [mode, setMode] = useState('max');
  const [startNode, setStartNode] = useState('');
  const [endNode, setEndNode] = useState('');
  const { size, containerRef, startResize } = useResizable(55);

  const handleRun = useCallback(() => {
    if (!vertices.length) { alert('Ajoutez au moins un sommet.'); return; }
    if (!startNode || !endNode) { alert('Choisissez un depart et une arrivee.'); return; }
    try {
      runCalculation(startNode, endNode, mode);
    } catch (err) {
      alert(err.message);
    }
  }, [vertices, startNode, endNode, mode, runCalculation]);

  const handleReset = () => {
    resetGraph();
    setStartNode('');
    setEndNode('');
  };

  return (
    <div className="app-shell">
      <AppHeader />
      <div className="app-body">
        <ControlPanel
          vertices={vertices}
          edges={edges}
          addVertex={addVertex}
          startNode={startNode}
          setStartNode={setStartNode}
          endNode={endNode}
          setEndNode={setEndNode}
        />
        <div className="main-content" ref={containerRef}>
          <div className="canvas-zone" style={{ height: `${size}%` }}>
            <GraphCanvas
              vertices={vertices}
              edges={edges}
              result={result}
              addVertex={addVertex}
              removeVertex={removeVertex}
              renameVertex={renameVertex}
              addEdge={addEdge}
              removeEdge={removeEdge}
              updateEdgeValue={updateEdgeValue}
            />
          </div>
          <div className="splitter" onMouseDown={startResize}>
            <span className="splitter__handle" />
          </div>
          <div className="bottom-zone" style={{ height: `${100 - size}%` }}>
            <Toolbar mode={mode} setMode={setMode} onRun={handleRun} onReset={handleReset} />
            <div className="bottom-zone__content">
              <ResultsPanel result={result} mode={mode} />
              <IterationTable history={result?.history} vertices={vertices} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}