import { useGlobalComponent, useMergedOverrides } from 'rhino/hooks/overrides';
import FieldLayoutVertical from '../FieldLayoutVertical';
import FieldDateTime from '../fields/FieldDateTime';
import FieldLayoutFloating from '../FieldLayoutFloating';
import FieldLayoutHorizontal from '../FieldLayoutHorizontal';

const BASE_OVERRIDES = {
  Field: FieldDateTime
};

export const FieldGroupDateTimeBase = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldLayoutVertical overrides={mergedOverrides} {...props} />;
};

export const FieldGroupHorizontalDateTime = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldLayoutHorizontal overrides={mergedOverrides} {...props} />;
};

export const FieldGroupFloatingDateTime = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldLayoutFloating overrides={mergedOverrides} {...props} />;
};

const FieldGroupDateTime = (props) =>
  useGlobalComponent('FieldGroupDateTime', FieldGroupDateTimeBase, props);

export default FieldGroupDateTime;
