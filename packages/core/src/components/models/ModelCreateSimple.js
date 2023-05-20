import PropTypes from 'prop-types';

import ModelCreateProvider from './ModelCreateProvider';
import { useMemo } from 'react';
import { Spinner } from 'reactstrap';
import { useModelCreateController } from 'rhino/hooks/controllers';

export const ModelCreateSimple = ({ children, fallback = true, ...props }) => {
  const controller = useModelCreateController(props);
  const {
    showParent: { isLoading }
  } = controller;

  // Fallback mirrors React 18 Suspense
  const renderFallback = useMemo(() => {
    if (!isLoading || !fallback) return children;

    if (fallback === true) return <Spinner />;

    return fallback;
  }, [children, fallback, isLoading]);

  return (
    <ModelCreateProvider {...controller}>{renderFallback}</ModelCreateProvider>
  );
};

ModelCreateSimple.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default ModelCreateSimple;
