import { useGlobalComponent, useMergedOverrides } from '../../../hooks/overrides';
import FieldLayoutVertical from '../FieldLayoutVertical';
import FieldInteger from '../fields/FieldInteger';
import FieldLayoutFloating from '../FieldLayoutFloating';
import FieldLayoutHorizontal from '../FieldLayoutHorizontal';

const BASE_OVERRIDES = {
  Field: FieldInteger
};

export const FieldGroupIntegerBase = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldLayoutVertical overrides={mergedOverrides} {...props} />;
};

export const FieldGroupHorizontalInteger = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldLayoutHorizontal overrides={mergedOverrides} {...props} />;
};

export const FieldGroupFloatingInteger = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldLayoutFloating overrides={mergedOverrides} {...props} />;
};

const FieldGroupInteger = (props) =>
  useGlobalComponent('FieldGroupInteger', FieldGroupIntegerBase, props);

export default FieldGroupInteger;
