import { createContext } from 'react';
import FormProvider from '../forms/FormProvider';

export const ModelShowContext = createContext();

const ModelShowProvider = ({ children, ...props }) => {
  const { methods } = props;

  return (
    <ModelShowContext.Provider value={{ ...props }}>
      <FormProvider {...methods}>{children}</FormProvider>
    </ModelShowContext.Provider>
  );
};

export default ModelShowProvider;
