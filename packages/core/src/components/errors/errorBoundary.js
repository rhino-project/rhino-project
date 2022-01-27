import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'reactstrap';

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
    throw error;
  }

  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <div className="pt-3">
          <Alert color="danger">
            <h4>
              Something went wrong. Please refresh the page to retry or use the
              menu to start over.
            </h4>
          </Alert>
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
