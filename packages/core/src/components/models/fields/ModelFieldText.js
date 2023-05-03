import PropTypes from 'prop-types';
import FieldText from 'rhino/components/forms/fields/FieldText';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

const ModelFieldTextBase = ({ model, ...props }) => <FieldText {...props} />;

const defaultComponents = { ModelFieldText: ModelFieldTextBase };

const ModelFieldText = ({ overrides, ...props }) => {
  const { ModelFieldText } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelFieldText {...props} />;
};

ModelFieldText.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export default ModelFieldText;
