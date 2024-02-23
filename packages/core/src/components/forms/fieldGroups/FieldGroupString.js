import { useGlobalComponent, useMergedOverrides } from '../../../hooks/overrides';
import { FieldLayoutVertical } from '../FieldLayoutVertical';
import { FieldString } from '../fields/FieldString';
import { FieldLayoutFloating } from '../FieldLayoutFloating';
import { FieldLayoutHorizontal } from '../FieldLayoutHorizontal';

const BASE_OVERRIDES = {
  Field: FieldString
};

export const FieldGroupStringBase = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldLayoutVertical overrides={mergedOverrides} {...props} />;
};

export const FieldGroupHorizontalString = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldLayoutHorizontal overrides={mergedOverrides} {...props} />;
};

export const FieldGroupFloatingString = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldLayoutFloating overrides={mergedOverrides} {...props} />;
};

export const FieldGroupString = (props) =>
  useGlobalComponent('FieldGroupString', FieldGroupStringBase, props);
