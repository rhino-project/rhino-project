import React from 'react';
import PropTypes from 'prop-types';
import { Nav } from 'reactstrap';
import classnames from 'classnames';

const Sidebar = ({ children, extraClass }) => {
  return (
    <Nav
      id="sidebarMenu"
      className={classnames(
        'nav-sidebar',
        'col-md-3',
        'col-lg-2',
        'd-md-block',
        'bg-light',
        'sidebar',
        'collapse',
        extraClass
      )}
    >
      <div className="nav-sidebar-panel sticky-top pt-3 d-flex flex-column">
        {children}
      </div>
    </Nav>
  );
};

Sidebar.propTypes = {
  children: PropTypes.node,
  extraClass: PropTypes.string
};

export default Sidebar;
