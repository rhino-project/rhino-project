import PropTypes from 'prop-types';
import FieldPhone from 'rhino/components/forms/fields/FieldPhone';
import { useGlobalComponent } from 'rhino/hooks/overrides';

const ModelFieldPhoneBase = ({ model, ...props }) => {
  return <FieldPhone {...props} />;
};

ModelFieldPhoneBase.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

const ModelFieldPhone = (props) =>
  useGlobalComponent('ModelFieldPhone', ModelFieldPhoneBase, props);

export default ModelFieldPhone;
