import { createContext } from 'react';
import FormProvider from '../forms/FormProvider';
import { ModelContext } from './ModelProvider';
import RhinoDevTool from '../devtool/RhinoDevTool';

export const ModelShowContext = createContext();

const ModelShowProvider = ({ children, ...props }) => {
  const { methods, model } = props;

  return (
    <ModelContext.Provider value={{ model }}>
      <ModelShowContext.Provider value={{ ...props }}>
        {import.meta.env.MODE === 'development' && <RhinoDevTool />}
        <FormProvider {...methods}>{children}</FormProvider>
      </ModelShowContext.Provider>
    </ModelContext.Provider>
  );
};

export default ModelShowProvider;
