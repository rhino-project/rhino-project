import PropTypes from 'prop-types';
import { useState } from 'react';
import { Collapse, Container, Navbar, NavbarBrand } from 'reactstrap';
import { Icon } from '../icons';
import { LightLogo } from '../logos';
import { Sidebar } from './Sidebar';
import { useGlobalComponent } from '../../hooks';

export const ApplicationShellBase = ({
  children,
  primaryNavigationElement = null,
  secondaryNavigationElement = null
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNavbarOpen, setIsNavbarOpen] = useState(true);
  const openSidebar = () => {
    setIsSidebarOpen(true);
    setIsNavbarOpen(false);
  };
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <Container fluid className="px-0 w-100 h-100">
        <Collapse
          horizontal
          isOpen={isSidebarOpen}
          className="position-fixed z-fixed d-md-none h-100"
          onExited={() => setIsNavbarOpen(true)}
        >
          <div className="d-flex vw-100 h-100">
            <Sidebar id="sidebarMenuCollapsed">
              <div className="flex-grow-1">{primaryNavigationElement}</div>
              <div className="flex-shrink-1">{secondaryNavigationElement}</div>
            </Sidebar>
            <div
              className="text-light bg-secondary flex-grow-1 opacity-75 d-flex py-3 justify-content-center"
              style={{ opacity: 60 }}
              onClick={closeSidebar}
            >
              <Icon icon="x" role="button" height={40} width={40} />
            </div>
          </div>
        </Collapse>
        <div className="d-flex flex-column h-100">
          {isNavbarOpen && (
            <div className="align-self-start sticky-top w-100 d-md-none">
              <Navbar
                color="dark"
                dark
                className="px-4"
                expand={false}
                container={false}
              >
                <NavbarBrand>
                  <LightLogo height={36} />
                </NavbarBrand>
                <Icon
                  className="text-light"
                  icon="list"
                  onClick={openSidebar}
                />
              </Navbar>
            </div>
          )}
          <div className="d-md-flex flex-grow-1 h-100">
            <Sidebar extraClass="d-none flex-shrink-0">
              <div className="flex-grow-1">{primaryNavigationElement}</div>
              <div className="flex-shrink-1">{secondaryNavigationElement}</div>
            </Sidebar>
            <main className="flex-grow-1 overflow-hidden h-100" role="main">
              <Container fluid className="h-100 overflow-y-auto">
                {children}
              </Container>
            </main>
          </div>
        </div>
      </Container>
    </>
  );
};

ApplicationShellBase.propTypes = {
  children: PropTypes.node
};

export const ApplicationShell = (props) =>
  useGlobalComponent('ApplicationShell', ApplicationShellBase, props);
