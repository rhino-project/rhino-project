// Internal Dependencies
import { Target } from 'rhino/components/layouts';
import { DarkLogo } from 'rhino/components/logos';

// External Dependencies
import PropTypes from 'prop-types';
import { Col, Container, Row } from 'reactstrap';

const AuthPage = ({ children, description }) => {
  return (
    <Container className="h-100">
      <Target>
        <Row className="p-3 bg-white shadow rounded">
          <Col className="my-auto" md="6">
            <div className="auth-logo">
              <DarkLogo />
            </div>
            {description}
          </Col>
          <Col className="my-auto" md="6">
            {children}
          </Col>
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
