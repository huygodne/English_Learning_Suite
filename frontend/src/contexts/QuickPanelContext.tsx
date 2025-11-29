import React, { createContext, useContext, useState, ReactNode } from 'react';

type QuickPanelContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const QuickPanelContext = createContext<QuickPanelContextType | undefined>(undefined);

export const QuickPanelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <QuickPanelContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </QuickPanelContext.Provider>
  );
};

export const useQuickPanel = (): QuickPanelContextType => {
  const context = useContext(QuickPanelContext);
  if (!context) {
    throw new Error('useQuickPanel must be used within a QuickPanelProvider');
  }
  return context;
};


