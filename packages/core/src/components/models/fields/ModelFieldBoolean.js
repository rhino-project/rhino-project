import PropTypes from 'prop-types';
import FieldBoolean from 'rhino/components/forms/fields/FieldBoolean';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

const ModelFieldBooleanBase = ({ model, ...props }) => {
  return <FieldBoolean {...props} />;
};

const defaultComponents = { ModelFieldBoolean: ModelFieldBooleanBase };

const ModelFieldBoolean = ({ overrides, ...props }) => {
  const { ModelFieldBoolean } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelFieldBoolean {...props} />;
};

ModelFieldBoolean.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export default ModelFieldBoolean;
