import classnames from 'classnames';
import PropTypes from 'prop-types';
import { NavLink as RRNavLink } from 'react-router-dom';
import { NavLink, NavItem as RSNavItem } from 'reactstrap';

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
        <div className="nav-sidebar-section d-flex justify-content-between align-items-center px-0 mt-3 mb-1 text-capitalize text-gray-400">
          <span className="fw-medium">{title}</span>
          {icon && <NavIcon role="button" icon={icon} onClick={onIconClick} />}
        </div>
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
        <div className="d-flex align-items-center">
          {icon && <NavIcon icon={icon} />}
          <div className={classnames({ 'ms-2': icon })}>{title}</div>
        </div>
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
