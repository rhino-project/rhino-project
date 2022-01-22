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

import { LightLogo } from 'rhino/components/logos';
import Sidebar from './Sidebar';
import PrimaryNavigation from 'rhino/components/app/PrimaryNavigation';
import SecondaryNavigation from 'rhino/components/app/SecondaryNavigation';

const AdminShell = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handClick = () => setIsOpen(!isOpen);

  return (
    <>
      <Navbar color="dark" fixed="top" expand="md" dark className="sticky-top">
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
            </div>
            <SecondaryNavigation className="d-md-flex" />
          </Nav>
        </Collapse>
      </Navbar>
      <Container fluid>
        <div className="row">
          <Sidebar>
            <PrimaryNavigation />
          </Sidebar>

          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
            {children}
          </main>
        </div>
      </Container>
    </>
  );
};

export default AdminShell;

AdminShell.propTypes = {
  children: PropTypes.node
};
