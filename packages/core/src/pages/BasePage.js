import React from 'react';
import PropTypes from 'prop-types';
import { Spinner } from 'reactstrap';

import { Target } from 'rhino/components/layouts';
import ErrorBoundary from 'rhino/components/errors/errorBoundary';

const BasePage = ({ children, loading }) => {
  if (loading) {
    return (
      <Target>
        <Spinner className="mx-auto d-block" />
      </Target>
    );
  }

  return (
    <ErrorBoundary>
      <div className="pt-3">{children}</div>
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

export default BasePage;
