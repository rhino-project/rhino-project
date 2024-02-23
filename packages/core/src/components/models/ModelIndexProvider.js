import { createContext } from 'react';
import env from '@rhino-project/config/env';
import { ModelContext } from './ModelProvider';
import RhinoDevTool from '../devtool/RhinoDevTool';

export const ModelIndexContext = createContext();

const ModelIndexProvider = ({ children, ...props }) => {
  const { model } = props;

  return (
    <ModelContext.Provider value={{ model }}>
      <ModelIndexContext.Provider value={{ ...props }}>
        {/* Don't show dev tool if we're in a nested index */}
        {env.MODE === 'development' && !props.parentId && <RhinoDevTool />}
        {children}
      </ModelIndexContext.Provider>
    </ModelContext.Provider>
  );
};

export default ModelIndexProvider;
