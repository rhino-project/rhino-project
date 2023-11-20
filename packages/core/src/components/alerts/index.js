import React from 'react';
import PropTypes from 'prop-types';

import { Alert, UncontrolledAlert } from 'reactstrap';

export const DetailAlert = ({
  title,
  description,
  color = 'primary',
  closable = false,
  children
}) => {
  const AlertComponent = closable ? UncontrolledAlert : Alert;

  return (
    <AlertComponent color={color}>
      <h6>{title}</h6>
      {description && <p>{description}</p>}
      {children}
    </AlertComponent>
  );
};

DetailAlert.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  description: PropTypes.node,
  title: PropTypes.string.isRequired,
  closable: PropTypes.bool
};

export const SuccessAlert = (props) => (
  <DetailAlert {...props} color="success" />
);

export const DangerAlert = (props) => <DetailAlert {...props} color="danger" />;
