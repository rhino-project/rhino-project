import { Target } from '../../components/layouts';

// External Dependencies
import PropTypes from 'prop-types';
import { Col, Container, Row } from 'reactstrap';
import { useGlobalComponentForModel } from '../../hooks/overrides';
import { ThemedLogo } from '../../components/logos';

const AuthPageBase = ({ children, description }) => {
  return (
    <Container className="h-100">
      <Target>
        <Row className="p-3 shadow rounded">
          <Col className="my-auto" md="6">
            <div className="auth-logo">
              <ThemedLogo />
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

export const AuthPage = (props) =>
  useGlobalComponentForModel('AuthPage', AuthPageBase, props);
