import { createContext, useContext, useState, useCallback } from 'react';

const ScrollContext = createContext({ progress: 0, setProgress: () => {} });

/**
 * Provides scroll progress (0–1) to any descendent via useScrollProgress().
 * Progress is set by RouteLayout's scroll listener and consumed by Scene.jsx
 * components to drive scroll-linked 3D animations.
 */
export function ScrollProvider({ children }) {
  const [progress, setProgressRaw] = useState(0);

  const setProgress = useCallback((val) => {
    setProgressRaw(Math.min(1, Math.max(0, val)));
  }, []);

  return (
    <ScrollContext.Provider value={{ progress, setProgress }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScrollProgress() {
  return useContext(ScrollContext);
}
