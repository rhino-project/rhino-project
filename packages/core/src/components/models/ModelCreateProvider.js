import { createContext } from 'react';
import FormProvider from '../forms/FormProvider';
import { ModelContext } from './ModelProvider';

export const ModelCreateContext = createContext();

const ModelCreateProvider = ({ children, ...props }) => {
  const { methods, model } = props;

  return (
    <ModelContext.Provider value={{ model }}>
      <ModelCreateContext.Provider value={{ ...props }}>
        <FormProvider {...methods}>{children}</FormProvider>
      </ModelCreateContext.Provider>
    </ModelContext.Provider>
  );
};

export default ModelCreateProvider;
