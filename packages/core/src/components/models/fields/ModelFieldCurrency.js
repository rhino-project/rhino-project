import PropTypes from 'prop-types';
import { useController } from 'react-hook-form';
import { InputGroup, InputGroupAddon } from 'reactstrap';
import CurrencyFormat from 'react-currency-format';
import classnames from 'classnames';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

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
      <InputGroupAddon addonType="prepend">$</InputGroupAddon>
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

const defaultComponents = { ModelFieldCurrency: ModelFieldCurrencyBase };

const ModelFieldCurrency = ({ overrides, ...props }) => {
  const { ModelFieldCurrency } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelFieldCurrency {...props} />;
};

ModelFieldCurrency.propTypes = {
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export default ModelFieldCurrency;
