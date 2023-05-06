import { createContext } from 'react';
import FormProvider from '../forms/FormProvider';

export const ModelEditContext = createContext();

const ModelEditProvider = ({ children, ...props }) => {
  const { methods } = props;

  return (
    <ModelEditContext.Provider value={{ ...props }}>
      <FormProvider {...methods}>{children}</FormProvider>
    </ModelEditContext.Provider>
  );
};

export default ModelEditProvider;
