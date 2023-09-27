import PropTypes from 'prop-types';
import { Container } from 'reactstrap';

export const MaxWidth = ({ children }) => <Container>{children}</Container>;

MaxWidth.propTypes = {
  children: PropTypes.node
};

export const Target = ({ children }) => (
  <div className="h-100 d-flex align-items-center justify-content-center">
    <div className="flex-grow-1">{children}</div>
  </div>
);

Target.propTypes = {
  children: PropTypes.node
};
