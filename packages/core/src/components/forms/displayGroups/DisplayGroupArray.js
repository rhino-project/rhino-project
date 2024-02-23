import { useGlobalComponent, useMergedOverrides } from '../../../hooks/overrides';
import DisplayLayoutVertical from '../DisplayLayoutVertical';
import DisplayArray from '../displays/DisplayArray';
import DisplayLayoutHorizontal from '../DisplayLayoutHorizontal';
import DisplayLayoutFloating from '../DisplayLayoutFloating';

const BASE_OVERRIDES = {
  Display: DisplayArray
};

export const DisplayGroupVerticalArray = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <DisplayLayoutVertical overrides={mergedOverrides} {...props} />;
};

export const DisplayGroupHorizontalArray = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <DisplayLayoutHorizontal overrides={mergedOverrides} {...props} />;
};

export const DisplayGroupFloatingArray = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <DisplayLayoutFloating overrides={mergedOverrides} {...props} />;
};

export const DisplayGroupArray = (props) =>
  useGlobalComponent('DisplayGroupArray', DisplayGroupVerticalArray, props);
