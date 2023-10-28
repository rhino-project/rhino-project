import PropTypes from 'prop-types';
import FieldText from 'rhino/components/forms/fields/FieldText';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';

// eslint-disable-next-line no-unused-vars
const ModelFieldTextBase = ({ model, ...props }) => <FieldText {...props} />;

ModelFieldTextBase.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

const ModelFieldText = (props) =>
  useGlobalComponentForAttribute('ModelFieldText', ModelFieldTextBase, props);

export default ModelFieldText;
