import PropTypes from 'prop-types';
import { FieldCurrency } from '../../forms/fields/FieldCurrency';
import { InputGroup } from 'reactstrap';
import classnames from 'classnames';
import { useGlobalComponent } from 'rhino/hooks/overrides';

const ModelFieldCurrencyBase = ({ overrides, error, ...props }) => {
  return (
    <InputGroup
      className={classnames({
        'is-invalid': error
      })}
    >
      <span className="input-group-text">$</span>
      <FieldCurrency error={error} {...props} />
    </InputGroup>
  );
};

ModelFieldCurrencyBase.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

const ModelFieldCurrency = (props) =>
  useGlobalComponent('ModelFieldCurrency', ModelFieldCurrencyBase, props);

export default ModelFieldCurrency;
