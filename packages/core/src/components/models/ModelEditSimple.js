import PropTypes from 'prop-types';

import { ModelEditProvider } from './ModelEditProvider';
import { useModelEditController } from '../../hooks/controllers';
import { useMemo } from 'react';
import { Spinner } from 'reactstrap';

export const ModelEditSimple = ({ children, fallback = true, ...props }) => {
  const controller = useModelEditController(props);
  const {
    show: { isInitialLoading }
  } = controller;

  // Fallback mirrors React 18 Suspense
  const renderFallback = useMemo(() => {
    if (!isInitialLoading || !fallback) return children;

    if (fallback === true) return <Spinner />;

    return fallback;
  }, [children, fallback, isInitialLoading]);

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
