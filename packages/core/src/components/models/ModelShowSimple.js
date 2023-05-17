import PropTypes from 'prop-types';
import { useModelShowController } from 'rhino/hooks/controllers';
import ModelShowProvider from './ModelShowProvider';
import { useMemo } from 'react';
import { Spinner } from 'reactstrap';

export const ModelShowSimple = ({ children, fallback = true, ...props }) => {
  const controller = useModelShowController(props);
  const { isLoading } = controller;

  // Fallback mirrors React 18 Suspense
  const renderFallback = useMemo(() => {
    if (!isLoading || !fallback) return children;

    if (fallback === true) return <Spinner />;

    return fallback;
  }, [children, fallback, isLoading]);

  return (
    <ModelShowProvider {...controller}>{renderFallback}</ModelShowProvider>
  );
};

ModelShowSimple.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default ModelShowSimple;
