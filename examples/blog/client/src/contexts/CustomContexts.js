import React from 'react';
import PropTypes from 'prop-types';

const CustomContexts = ({ children }) => {
  return <>{children}</>;
};

CustomContexts.propTypes = {
  children: PropTypes.node
};

export default CustomContexts;
