import { createContext } from 'react';
import env from '@rhino-project/config/env';
import FormProvider from '../forms/FormProvider';
import { ModelContext } from './ModelProvider';
import RhinoDevTool from '../devtool/RhinoDevTool';

export const ModelCreateContext = createContext();

export const ModelCreateProvider = ({ children, ...props }) => {
  const { methods, model } = props;

  return (
    <ModelContext.Provider value={{ model }}>
      <ModelCreateContext.Provider value={{ ...props }}>
        {env.MODE === 'development' && <RhinoDevTool />}
        <FormProvider {...methods}>{children}</FormProvider>
      </ModelCreateContext.Provider>
    </ModelContext.Provider>
  );
};
