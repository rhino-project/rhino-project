import PropTypes from 'prop-types';

import ModelEditProvider from './ModelEditProvider';
import { useModelEditController } from 'rhino/hooks/controllers';
import { useMemo } from 'react';
import { Spinner } from 'reactstrap';

export const ModelEditSimple = ({ children, fallback = true, ...props }) => {
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

ModelEditSimple.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default ModelEditSimple;
