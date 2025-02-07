import PropTypes from 'prop-types';

export const MaxWidth = ({ children }) => (
  <div className="container mx-auto">{children}</div>
);

MaxWidth.propTypes = {
  children: PropTypes.node
};

export const Target = ({ children }) => (
  <div className="h-full flex items-center justify-center">
    <div className="flex-grow">{children}</div>
  </div>
);

Target.propTypes = {
  children: PropTypes.node
};
