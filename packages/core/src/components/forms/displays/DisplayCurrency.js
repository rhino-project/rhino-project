import { useGlobalComponent } from '../../../hooks/overrides';
import { InputGroup } from 'reactstrap';
import { applyCurrencyMask } from '../../../utils/ui';
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

export const DisplayCurrency = (props) =>
  useGlobalComponent('DisplayCurrency', DisplayCurrencyBase, props);
