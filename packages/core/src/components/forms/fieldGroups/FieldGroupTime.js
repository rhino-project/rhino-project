import { useGlobalComponent, useMergedOverrides } from 'rhino/hooks/overrides';
import FieldLayoutVertical from '../FieldLayoutVertical';
import FieldTime from '../fields/FieldTime';
import FieldLayoutFloating from '../FieldLayoutFloating';
import FieldLayoutHorizontal from '../FieldLayoutHorizontal';

const BASE_OVERRIDES = {
  Field: FieldTime
};

export const FieldGroupTimeBase = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldLayoutVertical overrides={mergedOverrides} {...props} />;
};

export const FieldGroupHorizontalTime = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldLayoutHorizontal overrides={mergedOverrides} {...props} />;
};

export const FieldGroupFloatingTime = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldLayoutFloating overrides={mergedOverrides} {...props} />;
};

const FieldGroupTime = (props) =>
  useGlobalComponent('FieldGroupTime', FieldGroupTimeBase, props);

export default FieldGroupTime;
