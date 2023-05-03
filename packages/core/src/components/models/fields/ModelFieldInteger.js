import PropTypes from 'prop-types';
import FieldInteger from 'rhino/components/forms/fields/FieldInteger';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

const ModelFieldIntegerBase = ({ model, ...props }) => {
  return <FieldInteger {...props} />;
};

const defaultComponents = { ModelFieldInteger: ModelFieldIntegerBase };

const ModelFieldInteger = ({ overrides, ...props }) => {
  const { ModelFieldInteger } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelFieldInteger {...props} />;
};

ModelFieldInteger.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export default ModelFieldInteger;
