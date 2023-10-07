import classnames from 'classnames';
import PropTypes from 'prop-types';
import { InputGroup } from 'reactstrap';
import { useFieldError } from 'rhino/hooks/form';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import { FieldCurrency } from '../../forms/fields/FieldCurrency';

const ModelFieldCurrencyBase = ({ overrides, ...props }) => {
  // This bug was added in d08e56c. The error is not really passed down to the component
  // as a prop, it comes from the react form hooks. So error was always undefined.
  // FieldCurrency is able to get the error from the hooks and display the feedback.
  const error = useFieldError(props.path);
  return (
    <InputGroup
      className={classnames({
        'is-invalid': error
      })}
    >
      <span className="input-group-text">$</span>
      <FieldCurrency {...props} />
    </InputGroup>
  );
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
