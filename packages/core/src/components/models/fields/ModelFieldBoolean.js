import PropTypes from 'prop-types';
import FieldBoolean from 'rhino/components/forms/fields/FieldBoolean';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';

// eslint-disable-next-line no-unused-vars
const ModelFieldBooleanBase = ({ model, ...props }) => {
  return <FieldBoolean {...props} />;
};

ModelFieldBooleanBase.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

const ModelFieldBoolean = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldBoolean',
    ModelFieldBooleanBase,
    props
  );

export default ModelFieldBoolean;
