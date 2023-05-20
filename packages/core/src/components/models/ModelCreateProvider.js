import { createContext } from 'react';
import FormProvider from '../forms/FormProvider';

export const ModelCreateContext = createContext();

const ModelCreateProvider = ({ children, ...props }) => {
  const { methods } = props;

  return (
    <ModelCreateContext.Provider value={{ ...props }}>
      <FormProvider {...methods}>{children}</FormProvider>
    </ModelCreateContext.Provider>
  );
};

export default ModelCreateProvider;
