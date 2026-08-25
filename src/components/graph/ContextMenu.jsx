import { Share2, Edit3, Trash2 } from 'lucide-react';

export default function ContextMenu({ position, target, onAction, onClose }) {
  if (!position || !target) return null;

  return (
    <div
      className="context-menu"
      style={{ left: position.x, top: position.y }}
      onClick={(e) => e.stopPropagation()}
    >
      {target.type === 'vertex' && (
        <>
          <div className="context-menu__item" onClick={() => onAction('addArc', target.id)}>
            <Share2 size={16} strokeWidth={2.5} /> Ajouter un arc
          </div>
          <div className="context-menu__item" onClick={() => onAction('rename', target.id)}>
            <Edit3 size={16} strokeWidth={2.5} /> Renommer
          </div>
          <div className="context-menu__item context-menu__item--danger" onClick={() => onAction('delete', target.id)}>
            <Trash2 size={16} strokeWidth={2.5} /> Supprimer le sommet
          </div>
        </>
      )}
      {target.type === 'edge' && (
        <>
          <div className="context-menu__item" onClick={() => onAction('edit', target.index)}>
            <Edit3 size={16} strokeWidth={2.5} /> Modifier la valeur
          </div>
          <div className="context-menu__item context-menu__item--danger" onClick={() => onAction('delete', target.index)}>
            <Trash2 size={16} strokeWidth={2.5} /> Supprimer l'arc
          </div>
        </>
      )}
    </div>
  );
}