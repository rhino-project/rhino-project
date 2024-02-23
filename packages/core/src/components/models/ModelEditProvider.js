import { createContext } from 'react';
import env from '@rhino-project/config/env';
import FormProvider from '../forms/FormProvider';
import { ModelContext } from './ModelProvider';
import RhinoDevTool from '../devtool/RhinoDevTool';

export const ModelEditContext = createContext();

const ModelEditProvider = ({ children, ...props }) => {
  const { methods, model } = props;

  return (
    <ModelContext.Provider value={{ model }}>
      <ModelEditContext.Provider value={{ ...props }}>
        {env.MODE === 'development' && <RhinoDevTool />}
        <FormProvider {...methods}>{children}</FormProvider>
      </ModelEditContext.Provider>
    </ModelContext.Provider>
  );
};

export default ModelEditProvider;
