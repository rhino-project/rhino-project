import { ModelCreateProvider } from '@rhino-project/core/components/models';
import { useMemo } from 'react';
import {
  useModelCreateController,
  UseModelCreateControllerOptions
} from '@rhino-project/core/hooks';
import { CircularProgress } from '@heroui/react';
import { Resources } from '@rhino-project/core';

export type ModelCreateSimpleProps<T extends keyof Resources> = {
  children: React.ReactNode;
  fallback?: React.ReactNode | boolean;
} & UseModelCreateControllerOptions<T>;

export const ModelCreateSimple = <T extends keyof Resources>({
  children,
  fallback = true,
  ...props
}: ModelCreateSimpleProps<T>) => {
  const controller = useModelCreateController(props);
  const {
    showParent: { isLoading }
  } = controller;

  // Fallback mirrors React 18 Suspense
  const renderFallback = useMemo(() => {
    if (!isLoading || !fallback) return children;

    if (fallback === true) return <CircularProgress />;

    return fallback;
  }, [children, fallback, isLoading]);

  return (
    <ModelCreateProvider {...controller}>{renderFallback}</ModelCreateProvider>
  );
};
