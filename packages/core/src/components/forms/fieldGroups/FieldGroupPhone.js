import { useGlobalComponent, useMergedOverrides } from '../../../hooks/overrides';
import { FieldLayoutVertical } from '../FieldLayoutVertical';
import { FieldPhone } from '../fields/FieldPhone';
import { FieldLayoutFloating } from '../FieldLayoutFloating';
import { FieldLayoutHorizontal } from '../FieldLayoutHorizontal';

const BASE_OVERRIDES = {
  Field: FieldPhone
};

export const FieldGroupPhoneBase = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldLayoutVertical overrides={mergedOverrides} {...props} />;
};

export const FieldGroupHorizontalPhone = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldLayoutHorizontal overrides={mergedOverrides} {...props} />;
};

export const FieldGroupFloatingPhone = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldLayoutFloating overrides={mergedOverrides} {...props} />;
};

export const FieldGroupPhone = (props) =>
  useGlobalComponent('FieldGroupPhone', FieldGroupPhoneBase, props);
