import { useState } from 'react';
import { Plus } from 'lucide-react';
import DuoButton from '../ui/DuoButton';
import DuoCard from '../ui/DuoCard';
import ArcList from './ArcList';

export default function ControlPanel({ vertices, edges, addVertex, startNode, setStartNode, endNode, setEndNode }) {
  const [name, setName] = useState('');

  const handleAdd = () => {
    if (!name.trim()) return;
    addVertex(100 + Math.random() * 300, 100 + Math.random() * 200, name.trim());
    setName('');
  };

  return (
    <aside className="control-panel">
      <DuoCard title="Ajouter un sommet">
        <input
          className="duo-input"
          placeholder="Nom du sommet"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <DuoButton icon={Plus} onClick={handleAdd}>Ajouter</DuoButton>
      </DuoCard>

      <DuoCard title="Point de depart">
        <select className="duo-select" value={startNode} onChange={(e) => setStartNode(e.target.value)}>
          <option value="">-- Choisir --</option>
          {vertices.map(v => <option key={v.id} value={v.id}>{v.id}</option>)}
        </select>
      </DuoCard>

      <DuoCard title="Point d'arrivee">
        <select className="duo-select" value={endNode} onChange={(e) => setEndNode(e.target.value)}>
          <option value="">-- Choisir --</option>
          {vertices.map(v => <option key={v.id} value={v.id}>{v.id}</option>)}
        </select>
      </DuoCard>

      <DuoCard title="Liste des arcs">
        <ArcList edges={edges} />
      </DuoCard>
    </aside>
  );
}