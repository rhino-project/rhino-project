import { createContext } from 'react';
import FormProvider from '../forms/FormProvider';

export const ModelEditContext = createContext();

const ModelEditProvider = ({ children, ...props }) => {
  return (
    <ModelEditContext.Provider value={props}>
      <FormProvider {...props.methods}>{children}</FormProvider>
    </ModelEditContext.Provider>
  );
};

export default ModelEditProvider;
