import PropTypes from 'prop-types';

import ModelIndexProvider from './ModelIndexProvider';
import { useModelIndexController } from '../../hooks/controllers';
import { Spinner } from 'reactstrap';
import { useMemo } from 'react';

export const ModelIndexSimple = ({ children, fallback = false, ...props }) => {
  const controller = useModelIndexController({
    ...props
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
