import { createContext } from 'react';
import FormProvider from '../forms/FormProvider';

export const ModelCreateContext = createContext();

const ModelCreateProvider = ({ children, ...props }) => {
  return (
    <ModelCreateContext.Provider value={props}>
      <FormProvider {...props.methods}>{children}</FormProvider>
    </ModelCreateContext.Provider>
  );
};

export default ModelCreateProvider;
