import { useGlobalComponent, useMergedOverrides } from '../../../hooks/overrides';
import { DisplayLayoutVertical } from '../DisplayLayoutVertical';
import { DisplayDate } from '../displays/DisplayDate';
import { DisplayLayoutHorizontal } from '../DisplayLayoutHorizontal';
import { DisplayLayoutFloating } from '../DisplayLayoutFloating';

const BASE_OVERRIDES = {
  Display: DisplayDate
};

export const DisplayGroupVerticalDate = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <DisplayLayoutVertical overrides={mergedOverrides} {...props} />;
};

export const DisplayGroupHorizontalDate = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <DisplayLayoutHorizontal overrides={mergedOverrides} {...props} />;
};

export const DisplayGroupFloatingDate = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <DisplayLayoutFloating overrides={mergedOverrides} {...props} />;
};

export const DisplayGroupDate = (props) =>
  useGlobalComponent('DisplayGroupDate', DisplayGroupVerticalDate, props);
