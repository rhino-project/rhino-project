import { useGlobalComponent, useMergedOverrides } from '../../../hooks/overrides';
import FieldLayoutVertical from '../FieldLayoutVertical';
import FieldCountry from '../fields/FieldCountry';
import FieldLayoutHorizontal from '../FieldLayoutHorizontal';

const BASE_OVERRIDES = {
  Field: FieldCountry
};

export const FieldGroupCountryBase = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldLayoutVertical overrides={mergedOverrides} {...props} />;
};

export const FieldGroupHorizontalCountry = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldLayoutHorizontal overrides={mergedOverrides} {...props} />;
};

export const FieldGroupFloatingCountry = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return (
    <FieldLayoutVertical overrides={mergedOverrides} labelHidden {...props} />
  );
};

export const FieldGroupCountry = (props) =>
  useGlobalComponent('FieldGroupCountry', FieldGroupCountryBase, props);
