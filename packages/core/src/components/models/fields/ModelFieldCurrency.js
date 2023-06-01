import PropTypes from 'prop-types';
import { useController } from 'react-hook-form';
import { InputGroup } from 'reactstrap';
import CurrencyFormat from 'react-currency-format';
import classnames from 'classnames';
import { useGlobalComponent } from 'rhino/hooks/overrides';

export const ModelFieldCurrencyBase = ({ model, ...props }) => {
  const { path } = props;
  const {
    field: { value, ...fieldProps },
    fieldState: { error }
  } = useController({
    name: path
  });

  return (
    <InputGroup
      className={classnames({
        'is-invalid': error
      })}
    >
      <span className="input-group-text">$</span>
      <CurrencyFormat
        {...fieldProps}
        value={value || ''}
        decimalSeparator={'.'}
        decimalScale={2}
        fixedDecimalScale={true}
        className={`form-control ${!!error ? 'border-danger' : ''}`}
        inputmode="numeric"
      />
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
