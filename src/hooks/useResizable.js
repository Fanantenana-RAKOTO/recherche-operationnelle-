import { useState, useRef, useCallback } from 'react';

export function useResizable(initialPercent = 60, min = 20, max = 80) {
  const [size, setSize] = useState(initialPercent);
  const containerRef = useRef(null);

  const startResize = useCallback((e) => {
    e.preventDefault();
    const startY = e.clientY;
    const startSize = size;

    const onMove = (moveEvent) => {
      if (!containerRef.current) return;
      const containerHeight = containerRef.current.clientHeight;
      const delta = moveEvent.clientY - startY;
      const next = startSize + (delta / containerHeight) * 100;
      if (next >= min && next <= max) setSize(next);
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [size, min, max]);

  return { size, containerRef, startResize };
}