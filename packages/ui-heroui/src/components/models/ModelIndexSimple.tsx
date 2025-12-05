import { ModelIndexProvider } from '@rhino-project/core/components/models';
import {
  useModelIndexController,
  UseModelIndexControllerOptions
} from '@rhino-project/core/hooks';
import { useEffect, useMemo } from 'react';
import { CircularProgress } from '@heroui/react';
import { Resources } from '@rhino-project/core';
import { useLocation, useNavigate, useSearch } from '@tanstack/react-router';

export type ModelIndexSimpleProp<T extends keyof Resources> = {
  children: React.ReactNode;
  fallback?: React.ReactNode | boolean;
  syncUrl?: boolean;
} & UseModelIndexControllerOptions<T>;

export const ModelIndexSimple = <T extends keyof Resources>({
  children,
  fallback = false,
  syncUrl = false,
  ...props
}: ModelIndexSimpleProp<T>) => {
  const initialState = useSearch({ strict: false });
  const controller = useModelIndexController({
    ...(syncUrl && { initialState }),
    ...props
  });
  const {
    isEqualToDefault,
    filter,
    geospatial,
    fullFilter,
    search,
    limit,
    offset,
    order
  } = controller;
  const { isLoading } = controller;
  const navigate = useNavigate();
  const location = useLocation();

  // Fallback mirrors React 18 Suspense
  const renderFallback = useMemo(() => {
    if (!isLoading || !fallback) return children;

    if (fallback === true) return <CircularProgress />;

    return fallback;
  }, [children, fallback, isLoading]);

  useEffect(() => {
    if (!syncUrl) return;

    // If the current state is the same as the default state, remove the query params from the URL but only if they are not already empty
    if (isEqualToDefault && location.search) {
      navigate({ to: location.pathname, search: {} });

      // Else update the url
    } else {
      navigate({
        to: location.pathname,
        search: {
          filter,
          geospatial,
          limit,
          offset,
          order,
          search
        }
      });
    }

    // https://github.com/facebook/react/issues/22305#issuecomment-1113508762
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncUrl, filter, geospatial, fullFilter, search, limit, offset, order]);

  return (
    <ModelIndexProvider {...controller}>{renderFallback}</ModelIndexProvider>
  );
};
