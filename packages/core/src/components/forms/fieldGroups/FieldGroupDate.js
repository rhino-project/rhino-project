import {
  useGlobalComponent,
  useMergedOverrides
} from '../../../hooks/overrides';
import { FieldLayoutVertical } from '../FieldLayoutVertical';
import { FieldDate } from '../fields/FieldDate';
import { FieldLayoutFloating } from '../FieldLayoutFloating';
import { FieldLayoutHorizontal } from '../FieldLayoutHorizontal';

const BASE_OVERRIDES = {
  Field: FieldDate
};

export const FieldGroupDateBase = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldLayoutVertical overrides={mergedOverrides} {...props} />;
};

export const FieldGroupHorizontalDate = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldLayoutHorizontal overrides={mergedOverrides} {...props} />;
};

export const FieldGroupFloatingDate = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldLayoutFloating overrides={mergedOverrides} {...props} />;
};

export const FieldGroupDate = (props) =>
  useGlobalComponent('FieldGroupDate', FieldGroupDateBase, props);
