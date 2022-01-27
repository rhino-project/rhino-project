import React from 'react';
import PropTypes from 'prop-types';
import { NavLink as RRNavLink } from 'react-router-dom';
import { NavLink, NavItem as RSNavItem } from 'reactstrap';
import classnames from 'classnames';

import { NavIcon } from 'rhino/components/icons';

export const NavSection = ({
  title,
  icon,
  onIconClick,
  children,
  className
}) => {
  return (
    <div className={className}>
      {title && (
        <h6 className="nav-sidebar-section d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-uppercase text-muted">
          <span>{title}</span>
          {icon && <NavIcon role="button" icon={icon} onClick={onIconClick} />}
        </h6>
      )}
      <ul className="nav flex-column">{children}</ul>
    </div>
  );
};

NavSection.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.node,
  children: PropTypes.node.isRequired,
  onIconClick: PropTypes.func,
  className: PropTypes.string
};

export const NavItem = ({ title, icon, extraClass, ...props }) => {
  return (
    <RSNavItem>
      <NavLink
        tag={RRNavLink}
        className={classnames(
          'd-flex',
          'flex-row',
          'align-items-center',
          'justify-content-start',
          extraClass
        )}
        {...props}
      >
        <NavIcon icon={icon} />
        <div>{title}</div>
      </NavLink>
    </RSNavItem>
  );
};

NavItem.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
  extraClass: PropTypes.string
};
