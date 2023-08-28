import PropTypes from 'prop-types';
import FieldBoolean from 'rhino/components/forms/fields/FieldBoolean';
import { useGlobalComponent } from 'rhino/hooks/overrides';

const ModelFieldBooleanBase = ({ model, ...props }) => {
  return <FieldBoolean {...props} />;
};

ModelFieldBooleanBase.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

const ModelFieldBoolean = (props) =>
  useGlobalComponent('ModelFieldBoolean', ModelFieldBooleanBase, props);

export default ModelFieldBoolean;
