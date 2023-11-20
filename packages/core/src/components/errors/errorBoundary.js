import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'reactstrap';
import Rollbar from 'rollbar';
import { DangerAlert } from '../alerts';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    Rollbar.error(error);
  }

  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <div className="pt-3">
          <DangerAlert
            title={
              'Something went wrong. Please refresh the page to retry or use' +
              'the menu to start over.'
            }
          />
        </div>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.object
};

export default ErrorBoundary;
