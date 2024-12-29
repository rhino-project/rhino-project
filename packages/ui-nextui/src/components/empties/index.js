import React from 'react';
import PropTypes from 'prop-types';

export const Empty = ({ title, children }) => {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
};

Empty.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string.isRequired
};
