import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row, Container } from 'reactstrap';

import { DarkLogo } from 'rhino/components/logos';
import { Target } from 'rhino/components/layouts';

const AuthPage = ({ description, children }) => {
  return (
    <Container>
      <Target>
        <Row>
          <Col md="6">
            <DarkLogo
              className="block mb-3"
              style={{ height: '70px', width: '220px' }}
            />
            {description}
          </Col>
          <Col md="6">{children}</Col>
        </Row>
      </Target>
    </Container>
  );
};

AuthPage.propTypes = {
  children: PropTypes.node,
  description: PropTypes.node
};

export default AuthPage;
