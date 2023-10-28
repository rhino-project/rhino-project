import DisplayString from 'rhino/components/forms/displays/DisplayString';
import { applyCurrencyMask } from '../../../utils/ui';
import classnames from 'classnames';
import { InputGroup } from 'reactstrap';
import { useGlobalComponentForAttribute } from '../../../hooks/overrides';

// eslint-disable-next-line no-unused-vars
export const ModelDisplayCurrencyBase = ({ model, error, ...props }) => (
  <InputGroup
    className={classnames({
      'is-invalid': error
    })}
  >
    <span className="input-group-text">$</span>
    <DisplayString {...props} accessor={applyCurrencyMask} />
  </InputGroup>
);

const ModelDisplayCurrency = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayCurrency',
    ModelDisplayCurrencyBase,
    props
  );

export default ModelDisplayCurrency;
