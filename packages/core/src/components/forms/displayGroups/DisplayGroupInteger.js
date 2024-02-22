import { useGlobalComponent, useMergedOverrides } from 'rhino/hooks/overrides';
import DisplayLayoutVertical from '../DisplayLayoutVertical';
import DisplayInteger from '../displays/DisplayInteger';
import DisplayLayoutHorizontal from '../DisplayLayoutHorizontal';
import DisplayLayoutFloating from '../DisplayLayoutFloating';

const BASE_OVERRIDES = {
  Display: DisplayInteger
};

export const DisplayGroupVerticalInteger = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <DisplayLayoutVertical overrides={mergedOverrides} {...props} />;
};

export const DisplayGroupHorizontalInteger = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <DisplayLayoutHorizontal overrides={mergedOverrides} {...props} />;
};

export const DisplayGroupFloatingInteger = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <DisplayLayoutFloating overrides={mergedOverrides} {...props} />;
};

const DisplayGroupInteger = (props) =>
  useGlobalComponent('DisplayGroupInteger', DisplayGroupVerticalInteger, props);

export default DisplayGroupInteger;
