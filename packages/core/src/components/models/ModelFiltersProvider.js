import { createContext } from 'react';
import FormProvider from '../forms/FormProvider';

export const ModelFiltersContext = createContext();

const ModelFiltersProvider = ({ children, ...props }) => {
  const { methods } = props;

  return (
    <ModelFiltersContext.Provider value={{ ...props }}>
      <FormProvider {...methods}>{children}</FormProvider>
    </ModelFiltersContext.Provider>
  );
};

export default ModelFiltersProvider;
