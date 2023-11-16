import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import FieldCurrency from '../../forms/fields/FieldCurrency';

const ModelFieldCurrencyBase = (props) => {
  return <FieldCurrency {...props} />;
};

ModelFieldCurrencyBase.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

const ModelFieldCurrency = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldCurrency',
    ModelFieldCurrencyBase,
    props
  );

export default ModelFieldCurrency;
