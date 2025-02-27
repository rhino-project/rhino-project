import { useModelShowController } from '@rhino-project/core/hooks';
import { ModelShowProvider } from '@rhino-project/core/components/models';
import { useMemo } from 'react';
import { CircularProgress } from '@heroui/react';
import { Resources } from '@rhino-project/core';

export type UseModelShowControllerProps<T extends keyof Resources> = {
  model: T;
  modelId: string | number;
  paths?: (keyof Resources[T])[];
};

export type ModelShowSimpleProps<T extends keyof Resources> = {
  children: React.ReactNode;
  fallback?: React.ReactNode | boolean;
} & UseModelShowControllerProps<T>;

export const ModelShowSimple = <T extends keyof Resources>({
  children,
  fallback = true,
  ...props
}: ModelShowSimpleProps<T>) => {
  const controller = useModelShowController(props);
  const { isInitialLoading } = controller;

  // Fallback mirrors React 18 Suspense
  const renderFallback = useMemo(() => {
    if (!isInitialLoading || !fallback) return children;

    if (fallback === true) return <CircularProgress />;

    return fallback;
  }, [children, fallback, isInitialLoading]);

  return (
    <ModelShowProvider {...controller}>{renderFallback}</ModelShowProvider>
  );
};
