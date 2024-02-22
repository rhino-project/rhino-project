import { createContext } from 'react';

export const ModelContext = createContext();

const ModelProvider = ({ children, ...props }) => {
  return (
    <ModelContext.Provider value={{ ...props }}>
      {children}
    </ModelContext.Provider>
  );
};

export default ModelProvider;
