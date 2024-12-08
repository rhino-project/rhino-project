import PropTypes from 'prop-types';

import { ModelCreateProvider } from '@rhino-project/core/components/models';
import { useMemo } from 'react';
import { Spinner } from 'reactstrap';
import { useModelCreateController } from '@rhino-project/core/hooks';

export const ModelCreateSimple = ({ children, fallback = true, ...props }) => {
  const controller = useModelCreateController(props);
  const {
    showParent: { isInitialLoading }
  } = controller;

  // Fallback mirrors React 18 Suspense
  const renderFallback = useMemo(() => {
    if (!isInitialLoading || !fallback) return children;

    if (fallback === true) return <Spinner />;

    return fallback;
  }, [children, fallback, isInitialLoading]);

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
