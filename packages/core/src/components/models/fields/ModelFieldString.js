import PropTypes from 'prop-types';
import FieldInput from 'rhino/components/forms/fields/FieldInput';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import { useModelAndAttributeFromPath } from 'rhino/hooks/models';

const ModelFieldStringBase = ({ model, ...props }) => {
  const { path } = props;
  const { attribute } = useModelAndAttributeFromPath(model, path);

  return (
    <FieldInput
      minLength={attribute.minLength}
      maxLength={attribute.maxLength}
      {...props}
    />
  );
};

ModelFieldStringBase.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

const ModelFieldString = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldString',
    ModelFieldStringBase,
    props
  );

export default ModelFieldString;
