import { Sun, Moon, Waypoints } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function AppHeader() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div className="app-header__title">
        <Waypoints size={26} strokeWidth={2.5} />
        <span>Bellman-Kalaba</span>
      </div>
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Changer de thème">
        {darkMode ? <Sun size={20} strokeWidth={2.5} /> : <Moon size={20} strokeWidth={2.5} />}
      </button>
    </header>
  );
}