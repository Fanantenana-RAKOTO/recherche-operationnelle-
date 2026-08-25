import { AlertTriangle, Trophy } from 'lucide-react';
import DuoCard from '../ui/DuoCard';

const PATH_COLORS = ['#FF4B4B', '#1CB0F6', '#FFC800', '#CE82FF', '#58CC02', '#FF9600'];

export default function ResultsPanel({ result, mode }) {
  if (!result) {
    return (
      <DuoCard className="results-panel results-panel--empty">
        Lancez un calcul pour voir le resultat
      </DuoCard>
    );
  }

  return (
    <DuoCard className="results-panel">
      <div className="results-panel__value">
        <Trophy size={18} strokeWidth={2.5} />
        Valeur {mode === 'max' ? 'maximale' : 'minimale'} : <strong>{result.value}</strong>
      </div>

      {result.cycleDetected && (
        <div className="duo-warning">
          <AlertTriangle size={16} strokeWidth={2.5} />
          <div>
            Cycle(s) detecte(s) - arc(s) de valeur minimale ignore(s) pour le calcul :
            <ul>
              {result.ignoredDetails.map((e, i) => (
                <li key={i}>({e.from}) &rarr; ({e.to}) = {e.value}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <h4 className="results-panel__subtitle">
        {result.paths.length > 1 ? `${result.paths.length} chemins optimaux trouves` : 'Chemin optimal'}
      </h4>
      <div className="results-panel__paths">
        {result.paths.map((path, i) => (
          <div key={i} className="path-item" style={{ borderLeftColor: PATH_COLORS[i % PATH_COLORS.length] }}>
            <span className="path-item__dot" style={{ background: PATH_COLORS[i % PATH_COLORS.length] }} />
            {path.join(' \u2192 ')}
          </div>
        ))}
      </div>
      {result.truncated && (
        <p className="results-panel__note">Affichage limite aux premiers chemins trouves.</p>
      )}
    </DuoCard>
  );
}