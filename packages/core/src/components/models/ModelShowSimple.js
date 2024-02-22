import PropTypes from 'prop-types';
import { useModelShowController } from '../../hooks/controllers';
import ModelShowProvider from './ModelShowProvider';
import { useMemo } from 'react';
import { Spinner } from 'reactstrap';

export const ModelShowSimple = ({ children, fallback = true, ...props }) => {
  const controller = useModelShowController(props);
  const { isInitialLoading } = controller;

  // Fallback mirrors React 18 Suspense
  const renderFallback = useMemo(() => {
    if (!isInitialLoading || !fallback) return children;

    if (fallback === true) return <Spinner />;

    return fallback;
  }, [children, fallback, isInitialLoading]);

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
