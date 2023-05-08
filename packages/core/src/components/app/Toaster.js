import React from 'react';
import PropTypes from 'prop-types';
import { Toast, ToastHeader, ToastBody } from 'reactstrap';

import { useToast } from 'rhino/queries/toast';
import { CloseButton } from 'rhino/components/buttons';

const Toasted = ({ title, description, icon = 'primary', onClick }) => (
  <Toast className="mx-auto">
    <ToastHeader>
      {title}
      <CloseButton onClick={onClick} />
    </ToastHeader>
    <ToastBody>{description}</ToastBody>
  </Toast>
);

Toasted.propTypes = {
  description: PropTypes.node,
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

const Toaster = () => {
  // eslint-disable-next-line no-unused-vars
  const [toast, addToast, removeToast] = useToast();

  const handleClose = (id) => removeToast(id);

  const keys = Object.keys(toast?.data || {});

  if (keys.length < 1) return null;

  return (
    <div
      style={{
        display: 'block',
        width: '100%',
        position: 'absolute',
        bottom: '10px',
        zIndex: '10000'
      }}
    >
      {keys.map((t) => (
        <Toasted key={t} {...toast.data[t]} onClick={() => handleClose(t)} />
      ))}
    </div>
  );
};

Toaster.propTypes = {};

Toaster.defaultProps = {};

export default Toaster;
