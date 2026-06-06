import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const AITutorContext = createContext(null);

export function AITutorProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [lessonContext, setLessonContext] = useState(null);

  const open = useCallback(() => {
    setIsOpen(true);
    setIsMinimized(false);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setIsMinimized(false);
  }, []);

  const toggle = useCallback(() => {
    if (isOpen && !isMinimized) {
      close();
    } else {
      open();
    }
  }, [isOpen, isMinimized, open, close]);

  const minimize = useCallback(() => {
    setIsMinimized(true);
  }, []);

  const restore = useCallback(() => {
    setIsMinimized(false);
  }, []);

  const value = useMemo(() => ({
    isOpen,
    isMinimized,
    open,
    close,
    toggle,
    minimize,
    restore,
    lessonContext,
    setLessonContext
  }), [isOpen, isMinimized, open, close, toggle, minimize, restore, lessonContext]);

  return (
    <AITutorContext.Provider value={value}>
      {children}
    </AITutorContext.Provider>
  );
}

export function useAITutor() {
  const context = useContext(AITutorContext);
  if (!context) {
    throw new Error('useAITutor must be used within an AITutorProvider');
  }
  return context;
}
