import { createContext } from 'react';

export const ModelShowContext = createContext();

const ModelShowProvider = ({ children, ...props }) => {
  return (
    <ModelShowContext.Provider value={props}>
      {children}
    </ModelShowContext.Provider>
  );
};

export default ModelShowProvider;
