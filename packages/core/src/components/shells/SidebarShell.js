import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Collapse,
  Container,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler
} from 'reactstrap';

import { DarkLogo, LightLogo } from 'rhino/components/logos';
import Sidebar from './Sidebar';
import PrimaryNavigation from 'rhino/components/app/PrimaryNavigation';
import SecondaryNavigation from 'rhino/components/app/SecondaryNavigation';

const SidebarShell = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handClick = () => setIsOpen(!isOpen);

  return (
    <>
      <Navbar
        color="dark"
        fixed="top"
        expand="md"
        dark
        className="sticky-top d-flex d-md-none"
      >
        <NavbarBrand>
          <LightLogo style={{ height: '24px', width: '75px' }} />
        </NavbarBrand>
        <NavbarToggler className="d-md-none" onClick={handClick} />
        <Collapse
          isOpen={isOpen}
          navbar
          className="d-md-flex flex-md-row-reverse"
        >
          <Nav navbar>
            <div className="d-md-none">
              <PrimaryNavigation />
              <SecondaryNavigation className="d-md-flex" />
            </div>
          </Nav>
        </Collapse>
      </Navbar>
      <Container fluid>
        <div className="row">
          <Sidebar extraClass="pt-0">
            <NavbarBrand className="ms-2 mb-4">
              <DarkLogo style={{ height: '38px', width: '108px' }} />
            </NavbarBrand>
            <PrimaryNavigation />
            <SecondaryNavigation className="mt-auto" sidebarMode={true} />
          </Sidebar>

          <main role="main" className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            {children}
          </main>
        </div>
      </Container>
    </>
  );
};

export default SidebarShell;

SidebarShell.propTypes = {
  children: PropTypes.node
};
