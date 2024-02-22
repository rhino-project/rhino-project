import { useGlobalComponent, useMergedOverrides } from '../../../hooks/overrides';
import DisplayLayoutVertical from '../DisplayLayoutVertical';
import DisplayTime from '../displays/DisplayTime';
import DisplayLayoutHorizontal from '../DisplayLayoutHorizontal';
import DisplayLayoutFloating from '../DisplayLayoutFloating';

const BASE_OVERRIDES = {
  Display: DisplayTime
};

export const DisplayGroupVerticalTime = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <DisplayLayoutVertical overrides={mergedOverrides} {...props} />;
};

export const DisplayGroupHorizontalTime = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <DisplayLayoutHorizontal overrides={mergedOverrides} {...props} />;
};

export const DisplayGroupFloatingTime = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <DisplayLayoutFloating overrides={mergedOverrides} {...props} />;
};

const DisplayGroupTime = (props) =>
  useGlobalComponent('DisplayGroupTime', DisplayGroupVerticalTime, props);

export default DisplayGroupTime;
