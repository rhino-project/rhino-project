import PrimaryNavigation from 'rhino/components/app/PrimaryNavigation';
import SecondaryNavigation from 'rhino/components/app/SecondaryNavigation';
import { LightLogo } from 'rhino/components/logos';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  Collapse,
  Container,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler
} from 'reactstrap';

const TopbarShell = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handClick = () => setIsOpen(!isOpen);

  return (
    <>
      <Navbar color="dark" fixed="top" expand="md" dark className="sticky-top">
        <NavbarBrand>
          <LightLogo style={{ height: '24px', width: '75px' }} />
        </NavbarBrand>
        <PrimaryNavigation
          title=""
          className="d-none d-md-block"
          itemClass="text-light"
        />
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
          <main role="main" className="col-12 px-md-4">
            {children}
          </main>
        </div>
      </Container>
    </>
  );
};

export default TopbarShell;

TopbarShell.propTypes = {
  children: PropTypes.node
};
