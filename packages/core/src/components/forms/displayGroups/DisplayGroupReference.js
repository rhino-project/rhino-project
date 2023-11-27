import { useGlobalComponent, useMergedOverrides } from 'rhino/hooks/overrides';
import DisplayLayoutVertical from '../DisplayLayoutVertical';
import DisplayReference from '../displays/DisplayReference';
import DisplayLayoutHorizontal from '../DisplayLayoutHorizontal';
import DisplayLayoutFloating from '../DisplayLayoutFloating';

const BASE_OVERRIDES = {
  Display: DisplayReference
};

export const DisplayGroupVerticalReference = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <DisplayLayoutVertical overrides={mergedOverrides} {...props} />;
};

export const DisplayGroupHorizontalReference = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <DisplayLayoutHorizontal overrides={mergedOverrides} {...props} />;
};

export const DisplayGroupFloatingReference = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <DisplayLayoutFloating overrides={mergedOverrides} {...props} />;
};

const DisplayGroupReference = (props) =>
  useGlobalComponent(
    'DisplayGroupReference',
    DisplayGroupVerticalReference,
    props
  );

export default DisplayGroupReference;
