import { createContext } from 'react';
import { ModelContext } from './ModelProvider';
import RhinoDevTool from '../devtool/RhinoDevTool';

export const ModelIndexContext = createContext();

const ModelIndexProvider = ({ children, ...props }) => {
  const { model } = props;

  return (
    <ModelContext.Provider value={{ model }}>
      <ModelIndexContext.Provider value={{ ...props }}>
        {/* Don't show dev tool if we're in a nested index */}
        {import.meta.env.MODE === 'development' && !props.parentId && (
          <RhinoDevTool />
        )}
        {children}
      </ModelIndexContext.Provider>
    </ModelContext.Provider>
  );
};

export default ModelIndexProvider;
