import PropTypes from 'prop-types';
import FieldFloat from 'rhino/components/forms/fields/FieldFloat';
import { useGlobalComponent } from 'rhino/hooks/overrides';

const ModelFieldFloatBase = ({ model, ...props }) => {
  return <FieldFloat {...props} />;
};

ModelFieldFloatBase.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

const ModelFieldFloat = (props) =>
  useGlobalComponent('ModelFieldFloat', ModelFieldFloatBase, props);

export default ModelFieldFloat;
