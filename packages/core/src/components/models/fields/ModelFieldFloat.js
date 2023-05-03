import PropTypes from 'prop-types';
import FieldFloat from 'rhino/components/forms/fields/FieldFloat';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

const ModelFieldFloatBase = ({ model, ...props }) => {
  return <FieldFloat {...props} />;
};

const defaultComponents = { ModelFieldFloat: ModelFieldFloatBase };

const ModelFieldFloat = ({ overrides, ...props }) => {
  const { ModelFieldFloat } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelFieldFloat {...props} />;
};

ModelFieldFloat.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export default ModelFieldFloat;
