import { Play, RotateCcw, TrendingUp, TrendingDown } from 'lucide-react';
import DuoButton from '../ui/DuoButton';
import DuoToggle from '../ui/DuoToggle';

export default function Toolbar({ mode, setMode, onRun, onReset }) {
  return (
    <div className="toolbar">
      <DuoToggle
        value={mode}
        onChange={setMode}
        options={[
          { value: 'min', label: 'Minimisation', icon: TrendingDown },
          { value: 'max', label: 'Maximisation', icon: TrendingUp }
        ]}
      />
      <div className="toolbar__actions">
        <DuoButton variant="secondary" icon={RotateCcw} onClick={onReset}>Nouveau</DuoButton>
        <DuoButton icon={Play} onClick={onRun}>Calculer</DuoButton>
      </div>
    </div>
  );
}