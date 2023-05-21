import { createContext } from 'react';
import { ModelContext } from './ModelProvider';

export const ModelIndexContext = createContext();

const ModelIndexProvider = ({ children, ...props }) => {
  const { model } = props;

  return (
    <ModelContext.Provider value={{ model }}>
      <ModelIndexContext.Provider value={{ ...props }}>
        {children}
      </ModelIndexContext.Provider>
    </ModelContext.Provider>
  );
};

export default ModelIndexProvider;
