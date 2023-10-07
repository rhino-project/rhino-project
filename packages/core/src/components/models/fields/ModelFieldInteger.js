import PropTypes from 'prop-types';
import FieldInteger from 'rhino/components/forms/fields/FieldInteger';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';

const ModelFieldIntegerBase = ({ model, ...props }) => {
  return <FieldInteger {...props} />;
};

ModelFieldIntegerBase.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

const ModelFieldInteger = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldInteger',
    ModelFieldIntegerBase,
    props
  );

export default ModelFieldInteger;
