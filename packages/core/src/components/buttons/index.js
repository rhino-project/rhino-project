import PropTypes from 'prop-types';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { Button as RSButton } from 'reactstrap';

import { Icon } from '../icons';

export const Button = ({ loading = false, children, ...props }) => {
  if (!loading) return <RSButton {...props}>{children}</RSButton>;

  return (
    <RSButton {...props} disabled>
      <span
        className="spinner-border spinner-border-sm"
        role="status"
        aria-hidden="true"
      ></span>
      <span className="invisible">{children}</span>
    </RSButton>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  loading: PropTypes.bool.isRequired
};

Button.defaultProps = {
  loading: false
};

export const IconButton = ({ children, icon, ...props }) => (
  <Button {...props}>
    <Icon
      className="me-1"
      style={{ height: '1rem', width: '1rem' }}
      icon={icon}
    />
    {children}
  </Button>
);

IconButton.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.string.isRequired
};

export const OmniIconButton = ({ icon, endpoint, ...props }) => {
  const [loading, setLoading] = useState(false);

  return (
    <form method="post" action={endpoint} onSubmit={() => setLoading(true)}>
      <div className="omni-icon-btn">
        <Button
          className="omni-icon-btn__icon"
          {...props}
          type="submit"
          loading={loading}
        >
          <Icon style={{ height: '1rem', width: '1rem' }} icon={icon} />
        </Button>
      </div>
    </form>
  );
};

OmniIconButton.propTypes = {
  icon: PropTypes.string.isRequired,
  endpoint: PropTypes.string.isRequired
};

export const SubmitButton = (props) => (
  <Button {...props} color="primary" type="submit" />
);

const requiredToOrHref = (props, propName, componentName) => {
  if (!props.to && !props.href) {
    return new Error(
      `One of props 'to' or 'href' was not specified in '${componentName}'.`
    );
  }
};

export const LinkButton = (props) => {
  const tag = props.to ? NavLink : 'a';

  return <Button {...props} tag={tag} />;
};

LinkButton.propTypes = {
  to: PropTypes.string,
  href: PropTypes.string,
  toOrHref: requiredToOrHref
};

export const LinkIconButton = (props) => {
  const tag = props.to ? NavLink : 'a';

  return <IconButton {...props} tag={tag} />;
};

LinkIconButton.propTypes = {
  to: PropTypes.string,
  href: PropTypes.string,
  toOrHref: requiredToOrHref
};

export const CloseButton = (props) => <Button close {...props} />;
