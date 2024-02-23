import { useGlobalComponent, useMergedOverrides } from '../../../hooks/overrides';
import FieldLayoutVertical from '../FieldLayoutVertical';
import FieldFloat from '../fields/FieldFloat';
import FieldLayoutFloating from '../FieldLayoutFloating';
import FieldLayoutHorizontal from '../FieldLayoutHorizontal';

const BASE_OVERRIDES = {
  Field: FieldFloat
};

export const FieldGroupFloatBase = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldLayoutVertical overrides={mergedOverrides} {...props} />;
};

export const FieldGroupHorizontalFloat = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldLayoutHorizontal overrides={mergedOverrides} {...props} />;
};

export const FieldGroupFloatingFloat = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldLayoutFloating overrides={mergedOverrides} {...props} />;
};

const FieldGroupFloat = (props) =>
  useGlobalComponent('FieldGroupFloat', FieldGroupFloatBase, props);

export default FieldGroupFloat;
