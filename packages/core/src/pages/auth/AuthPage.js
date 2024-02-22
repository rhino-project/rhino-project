import { Target } from '../../components/layouts';
import { DarkLogo } from '../../components/logos';

// External Dependencies
import PropTypes from 'prop-types';
import { Col, Container, Row } from 'reactstrap';
import { useGlobalComponentForModel } from '../../hooks/overrides';

const AuthPageBase = ({ children, description }) => {
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

AuthPageBase.propTypes = {
  children: PropTypes.node,
  description: PropTypes.node
};

const AuthPage = (props) =>
  useGlobalComponentForModel('AuthPage', AuthPageBase, props);

export default AuthPage;
