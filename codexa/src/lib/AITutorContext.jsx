import { createContext, useContext, useState, useCallback } from 'react';

const AITutorContext = createContext(null);

export function AITutorProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

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

  return (
    <AITutorContext.Provider value={{ isOpen, isMinimized, open, close, toggle, minimize, restore }}>
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
