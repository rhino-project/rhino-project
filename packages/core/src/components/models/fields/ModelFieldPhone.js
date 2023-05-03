import PropTypes from 'prop-types';
import FieldPhone from 'rhino/components/forms/fields/FieldPhone';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

const ModelFieldPhoneBase = ({ model, ...props }) => {
  return <FieldPhone {...props} />;
};

const defaultComponents = { ModelFieldPhone: ModelFieldPhoneBase };

const ModelFieldPhone = ({ overrides, ...props }) => {
  const { ModelFieldPhone } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelFieldPhone {...props} />;
};

ModelFieldPhone.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export default ModelFieldPhone;
