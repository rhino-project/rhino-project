import { useGlobalComponent } from 'rhino/hooks/overrides';
import { InputGroup } from 'reactstrap';
import { applyCurrencyMask } from 'rhino/utils/ui';
import DisplayString from './DisplayString';

export const DisplayCurrencyBaseInput = (props) => {
  return (
    <DisplayString
      type="text"
      accessor={applyCurrencyMask}
      readOnly
      {...props}
    />
  );
};

export const DisplayCurrencyBase = (props) => {
  return (
    <InputGroup>
      <span className="input-group-text">$</span>
      <DisplayCurrencyBaseInput {...props} />
    </InputGroup>
  );
};

const DisplayCurrency = (props) =>
  useGlobalComponent('DisplayCurrency', DisplayCurrencyBase, props);

export default DisplayCurrency;
