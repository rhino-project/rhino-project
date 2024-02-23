import { useGlobalComponent, useMergedOverrides } from '../../../hooks/overrides';
import DisplayLayoutVertical from '../DisplayLayoutVertical';
import DisplayCurrency, {
  DisplayCurrencyBaseInput
} from '../displays/DisplayCurrency';
import DisplayLayoutHorizontal from '../DisplayLayoutHorizontal';
import DisplayLayoutFloating from '../DisplayLayoutFloating';

const BASE_OVERRIDES = {
  Display: DisplayCurrency
};

export const DisplayGroupVerticalCurrency = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <DisplayLayoutVertical overrides={mergedOverrides} {...props} />;
};

export const DisplayGroupHorizontalCurrency = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <DisplayLayoutHorizontal overrides={mergedOverrides} {...props} />;
};

// For floating we don't want the input group
// FIXME: No $ sign in front of floating currency
const BASE_FLOATING_OVERRIDES = {
  Display: DisplayCurrencyBaseInput
};

export const DisplayGroupFloatingCurrency = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(
    BASE_FLOATING_OVERRIDES,
    overrides
  );

  return <DisplayLayoutFloating overrides={mergedOverrides} {...props} />;
};

const DisplayGroupCurrency = (props) =>
  useGlobalComponent(
    'DisplayGroupCurrency',
    DisplayGroupVerticalCurrency,
    props
  );

export default DisplayGroupCurrency;
