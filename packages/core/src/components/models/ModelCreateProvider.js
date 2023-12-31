import { createContext } from 'react';
import FormProvider from '../forms/FormProvider';
import { ModelContext } from './ModelProvider';
import RhinoDevTool from '../devtool/RhinoDevTool';

export const ModelCreateContext = createContext();

const ModelCreateProvider = ({ children, ...props }) => {
  const { methods, model } = props;

  return (
    <ModelContext.Provider value={{ model }}>
      <ModelCreateContext.Provider value={{ ...props }}>
        {import.meta.env.MODE === 'development' && <RhinoDevTool />}
        <FormProvider {...methods}>{children}</FormProvider>
      </ModelCreateContext.Provider>
    </ModelContext.Provider>
  );
};

export default ModelCreateProvider;
