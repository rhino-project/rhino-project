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
  const { isLoading } = controller;

  // Fallback mirrors React 18 Suspense
  const renderFallback = useMemo(() => {
    if (!isLoading || !fallback) return children;

    if (fallback === true) return <Spinner />;

    return fallback;
  }, [children, fallback, isLoading]);

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
