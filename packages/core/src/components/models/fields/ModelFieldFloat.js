import PropTypes from 'prop-types';
import FieldFloat from 'rhino/components/forms/fields/FieldFloat';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';

// eslint-disable-next-line no-unused-vars
const ModelFieldFloatBase = ({ model, ...props }) => {
  return <FieldFloat {...props} />;
};

ModelFieldFloatBase.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

const ModelFieldFloat = (props) =>
  useGlobalComponentForAttribute('ModelFieldFloat', ModelFieldFloatBase, props);

export default ModelFieldFloat;
