import { useGlobalComponent, useMergedOverrides } from '../../../hooks/overrides';
import DisplayLayoutVertical from '../DisplayLayoutVertical';
import DisplayEnum from '../displays/DisplayEnum';
import DisplayLayoutHorizontal from '../DisplayLayoutHorizontal';
import DisplayLayoutFloating from '../DisplayLayoutFloating';

const BASE_OVERRIDES = {
  Display: DisplayEnum
};

export const DisplayGroupVerticalEnum = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <DisplayLayoutVertical overrides={mergedOverrides} {...props} />;
};

export const DisplayGroupHorizontalEnum = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <DisplayLayoutHorizontal overrides={mergedOverrides} {...props} />;
};

export const DisplayGroupFloatingEnum = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <DisplayLayoutFloating overrides={mergedOverrides} {...props} />;
};

export const DisplayGroupEnum = (props) =>
  useGlobalComponent('DisplayGroupEnum', DisplayGroupVerticalEnum, props);
