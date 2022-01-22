import React from 'react';
import PropTypes from 'prop-types';

import { Alert } from 'reactstrap';

export const DetailAlert = ({
  title,
  description,
  color = 'primary',
  children
}) => {
  return (
    <Alert color={color}>
      <h6>{title}</h6>
      {description && <p>{description}</p>}
      {children}
    </Alert>
  );
};

DetailAlert.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  description: PropTypes.node,
  title: PropTypes.string.isRequired
};

export const SuccessAlert = (props) => (
  <DetailAlert {...props} color="success" />
);

export const DangerAlert = (props) => <DetailAlert {...props} color="danger" />;
