import { ModelEditProvider } from '@rhino-project/core/components/models';
import {
  useModelEditController,
  UseModelEditControllerOptions
} from '@rhino-project/core/hooks';
import { useMemo } from 'react';
import { Resources } from '@rhino-project/core';
import { Spinner } from '@heroui/react';

export type ModelEditSimpleProps<T extends keyof Resources> = {
  children: React.ReactNode;
  fallback?: React.ReactNode | boolean;
} & UseModelEditControllerOptions<T>;

export const ModelEditSimple = <T extends keyof Resources>({
  children,
  fallback = true,
  ...props
}: ModelEditSimpleProps<T>) => {
  const controller = useModelEditController(props);
  const {
    show: { isLoading }
  } = controller;

  // Fallback mirrors React 18 Suspense
  const renderFallback = useMemo(() => {
    if (!isLoading || !fallback) return children;

    if (fallback === true) return <Spinner />;

    return fallback;
  }, [children, fallback, isLoading]);

  return (
    <ModelEditProvider {...controller}>{renderFallback}</ModelEditProvider>
  );
};
