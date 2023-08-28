// Internal Dependencies
import { DarkLogo } from 'rhino/components/logos';
import { Target } from 'rhino/components/layouts';

// External Dependencies
import { Col, Row, Container } from 'reactstrap';
import PropTypes from 'prop-types';

const AuthPage = ({ children, description }) => {
  return (
    <Container>
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
