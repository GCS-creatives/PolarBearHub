import { useState } from 'react';
import './DragReorderList.css';

/**
 * Wraps a list of items with native HTML5 drag-and-drop reordering.
 * Drag is a pointer-only convenience — every item still needs its own
 * keyboard-accessible move-up/move-down controls, which the caller renders
 * via `renderItem`. This component never replaces those controls, it just
 * adds a faster path for mouse/touch users.
 */
export default function DragReorderList({ items, getId, onReorder, renderItem }) {
  const [dragId, setDragId] = useState(null);
  const [overId, setOverId] = useState(null);

  function handleDrop(targetId) {
    if (dragId == null || dragId === targetId) {
      setDragId(null);
      setOverId(null);
      return;
    }
    const ids = items.map(getId);
    const from = ids.indexOf(dragId);
    const to = ids.indexOf(targetId);
    if (from === -1 || to === -1) return;
    ids.splice(from, 1);
    ids.splice(to, 0, dragId);
    onReorder(ids);
    setDragId(null);
    setOverId(null);
  }

  return (
    <div className="lh-draglist">
      {items.map((item) => {
        const id = getId(item);
        const isOver = overId === id && dragId !== id;
        const isDragging = dragId === id;
        return (
          <div
            key={id}
            className={`lh-draglist__row ${isOver ? 'lh-draglist__row--over' : ''} ${isDragging ? 'lh-draglist__row--dragging' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setOverId(id); }}
            onDragLeave={() => setOverId((cur) => (cur === id ? null : cur))}
            onDrop={(e) => { e.preventDefault(); handleDrop(id); }}
          >
            <span
              className="lh-draglist__handle"
              draggable
              onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; setDragId(id); }}
              onDragEnd={() => { setDragId(null); setOverId(null); }}
              aria-hidden="true"
              title="Drag to reorder"
            >
              ⠿
            </span>
            {renderItem(item)}
          </div>
        );
      })}
    </div>
  );
}
