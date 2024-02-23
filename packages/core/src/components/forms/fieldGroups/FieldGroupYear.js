import { useGlobalComponent, useMergedOverrides } from '../../../hooks/overrides';
import FieldLayoutVertical from '../FieldLayoutVertical';
import FieldYear from '../fields/FieldYear';
import FieldLayoutFloating from '../FieldLayoutFloating';
import FieldLayoutHorizontal from '../FieldLayoutHorizontal';

const BASE_OVERRIDES = {
  Field: FieldYear
};

export const FieldGroupYearBase = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldLayoutVertical overrides={mergedOverrides} {...props} />;
};

export const FieldGroupHorizontalYear = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldLayoutHorizontal overrides={mergedOverrides} {...props} />;
};

export const FieldGroupFloatingYear = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldLayoutFloating overrides={mergedOverrides} {...props} />;
};

const FieldGroupYear = (props) =>
  useGlobalComponent('FieldGroupYear', FieldGroupYearBase, props);

export default FieldGroupYear;
