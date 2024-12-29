import PropTypes from 'prop-types';
import { ErrorBoundary } from '../components/errors/errorBoundary';
import { Target } from '../components/layouts';
import { CircularProgress } from '@heroui/react';

export const BasePage = ({ children, loading }) => {
  if (loading) {
    return (
      <Target>
        <CircularProgress className="mx-auto d-block" />
      </Target>
    );
  }

  return (
    <ErrorBoundary>
      <div className="py-3">{children}</div>
    </ErrorBoundary>
  );
};

BasePage.propTypes = {
  children: PropTypes.node,
  loading: PropTypes.bool.isRequired
};

BasePage.defaultProps = {
  loading: false
};
