import { createContext } from 'react';

export const ModelIndexContext = createContext();

const ModelIndexProvider = ({ children, ...props }) => {
  return (
    <ModelIndexContext.Provider value={{ ...props }}>
      {children}
    </ModelIndexContext.Provider>
  );
};

export default ModelIndexProvider;
