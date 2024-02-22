import { createContext } from 'react';
import env from '@rhino-project/config/env';
import { FormProvider } from '../forms/FormProvider';
import { ModelContext } from './ModelProvider';
import { RhinoDevTool } from '../devtool/RhinoDevTool';

export const ModelShowContext = createContext();

export const ModelShowProvider = ({ children, ...props }) => {
  const { methods, model } = props;

  return (
    <ModelContext.Provider value={{ model }}>
      <ModelShowContext.Provider value={{ ...props }}>
        {env.MODE === 'development' && <RhinoDevTool />}
        <FormProvider {...methods}>{children}</FormProvider>
      </ModelShowContext.Provider>
    </ModelContext.Provider>
  );
};
