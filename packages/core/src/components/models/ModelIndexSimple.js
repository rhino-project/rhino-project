import PropTypes from 'prop-types';

import ModelIndexProvider from './ModelIndexProvider';
import { useModelIndexController } from 'rhino/hooks/controllers';
import { Spinner } from 'reactstrap';
import { useMemo } from 'react';

export const ModelIndexSimple = ({ children, fallback = true, ...props }) => {
  const controller = useModelIndexController({
    ...props,
    queryOptions: { keepPreviousData: true }
  });
  const { isInitialLoading } = controller;

  // Fallback mirrors React 18 Suspense
  const renderFallback = useMemo(() => {
    if (!isInitialLoading || !fallback) return children;

    if (fallback === true) return <Spinner />;

    return fallback;
  }, [children, fallback, isInitialLoading]);

  return (
    <ModelIndexProvider {...controller}>{renderFallback}</ModelIndexProvider>
  );
};

ModelIndexSimple.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default ModelIndexSimple;
