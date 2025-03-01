import { ModelIndexProvider } from '@rhino-project/core/components/models';
import {
  useModelIndexController,
  UseModelIndexControllerOptions
} from '@rhino-project/core/hooks';
import { useMemo } from 'react';
import { CircularProgress } from '@heroui/react';
import { Resources } from '@rhino-project/core';

export type ModelIndexSimpleProp<T extends keyof Resources> = {
  children: React.ReactNode;
  fallback?: React.ReactNode | boolean;
} & UseModelIndexControllerOptions<T>;

export const ModelIndexSimple = <T extends keyof Resources>({
  children,
  fallback = false,
  ...props
}: ModelIndexSimpleProp<T>) => {
  const controller = useModelIndexController({
    ...props
  });
  const { isLoading } = controller;

  // Fallback mirrors React 18 Suspense
  const renderFallback = useMemo(() => {
    if (!isLoading || !fallback) return children;

    if (fallback === true) return <CircularProgress />;

    return fallback;
  }, [children, fallback, isLoading]);

  return (
    <ModelIndexProvider {...controller}>{renderFallback}</ModelIndexProvider>
  );
};
