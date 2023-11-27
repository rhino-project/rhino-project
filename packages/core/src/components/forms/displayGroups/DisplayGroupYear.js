import { useGlobalComponent, useMergedOverrides } from 'rhino/hooks/overrides';
import DisplayLayoutVertical from '../DisplayLayoutVertical';
import DisplayYear from '../displays/DisplayYear';
import DisplayLayoutHorizontal from '../DisplayLayoutHorizontal';
import DisplayLayoutFloating from '../DisplayLayoutFloating';

const BASE_OVERRIDES = {
  Display: DisplayYear
};

export const DisplayGroupVerticalYear = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <DisplayLayoutVertical overrides={mergedOverrides} {...props} />;
};

export const DisplayGroupHorizontalYear = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <DisplayLayoutHorizontal overrides={mergedOverrides} {...props} />;
};

export const DisplayGroupFloatingYear = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <DisplayLayoutFloating overrides={mergedOverrides} {...props} />;
};

const DisplayGroupYear = (props) =>
  useGlobalComponent('DisplayGroupYear', DisplayGroupVerticalYear, props);

export default DisplayGroupYear;
