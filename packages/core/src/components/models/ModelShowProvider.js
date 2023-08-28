import { createContext } from 'react';
import FormProvider from '../forms/FormProvider';
import { ModelContext } from './ModelProvider';

export const ModelShowContext = createContext();

const ModelShowProvider = ({ children, ...props }) => {
  const { methods, model } = props;

  return (
    <ModelContext.Provider value={{ model }}>
      <ModelShowContext.Provider value={{ ...props }}>
        <FormProvider {...methods}>{children}</FormProvider>
      </ModelShowContext.Provider>
    </ModelContext.Provider>
  );
};

export default ModelShowProvider;
