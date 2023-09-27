import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Nav, NavbarBrand } from 'reactstrap';
import { LightLogo } from 'rhino/components/logos';

const Sidebar = ({ id = 'sidebarMenu', children, extraClass }) => {
  return (
    <Nav
      vertical
      id={id}
      className={classnames(
        'nav-sidebar',
        'navbar-dark',
        'd-md-block',
        'bg-dark',
        'sidebar',
        'top-0',
        'bottom-0',
        'left-0',
        'p-3',
        'h-100',
        extraClass
      )}
    >
      <div className="d-flex flex-column w-100 h-100">
        <NavbarBrand className="flex-shrink-1">
          <LightLogo />
        </NavbarBrand>
        <hr className="border-top border-gray-700 flex-shrink-1" />
        <div className="nav-sidebar sticky-top overflow-y-auto overflow-x-hidden d-flex flex-column flex-grow-1 w-100">
          {children}
        </div>
      </div>
    </Nav>
  );
};

Sidebar.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  extraClass: PropTypes.string
};

export default Sidebar;
