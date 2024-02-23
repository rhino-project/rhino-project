import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import icons from 'bootstrap-icons/bootstrap-icons.svg';

// eslint-disable-next-line react/display-name
export const Icon = forwardRef(
  ({ icon, height = 32, width = 32, ...props }, ref) => {
    return (
      <svg
        fill="currentColor"
        ref={ref}
        height={height}
        width={width}
        {...props}
      >
        <use xlinkHref={`${icons}#${icon}`} />
      </svg>
    );
  }
);

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  height: PropTypes.number,
  width: PropTypes.number
};

export const NavIcon = ({ icon, extraClass, ...props }) => {
  return (
    <svg
      className={classnames('nav-icon', 'me-1', extraClass)}
      fill="currentColor"
      {...props}
    >
      <use xlinkHref={`${icons}#${icon}`} />
    </svg>
  );
};

NavIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  extraClass: PropTypes.string
};
