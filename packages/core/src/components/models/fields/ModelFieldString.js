import PropTypes from 'prop-types';
import FieldInput from 'rhino/components/forms/fields/FieldInput';
import { useGlobalOverrides } from 'rhino/hooks/overrides';
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

const defaultComponents = { ModelFieldString: ModelFieldStringBase };

const ModelFieldString = ({ overrides, ...props }) => {
  const { ModelFieldString } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelFieldString {...props} />;
};

ModelFieldString.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export default ModelFieldString;
