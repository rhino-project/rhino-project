import { createContext, useMemo } from 'react';
import FormProvider from '../forms/FormProvider';
import { useModelCreateController } from 'rhino/hooks/controllers';
import { Spinner } from 'reactstrap';

export const ModelCreateContext = createContext();

const ModelCreateProvider = ({ children, fallback = true, ...props }) => {
  const controller = useModelCreateController(props);
  const {
    showParent: { isLoading },
    methods
  } = controller;

  const renderFallback = useMemo(() => {
    if (!isLoading || !fallback) return null;

    if (fallback === true) return <Spinner />;

    return fallback;
  }, [fallback, isLoading]);

  return (
    <ModelCreateContext.Provider value={{ ...controller }}>
      <FormProvider {...methods}>{renderFallback || children}</FormProvider>
    </ModelCreateContext.Provider>
  );
};

export default ModelCreateProvider;
