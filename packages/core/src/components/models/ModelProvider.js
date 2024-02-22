import { createContext } from 'react';

export const ModelContext = createContext();

export const ModelProvider = ({ children, ...props }) => {
  return (
    <ModelContext.Provider value={{ ...props }}>
      {children}
    </ModelContext.Provider>
  );
};
