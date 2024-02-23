import { FormGroup } from 'reactstrap';

import { useGlobalComponent, useOverrides } from '../../hooks/overrides';
import { FieldInput as Field } from './fields/FieldInput';
import { useFieldInheritedProps } from '../../hooks/form';
import { FilterLabel } from './FilterLabel';

const INHERITED_PROP_OPTIONS = {
  prefix: 'FilterLayoutVertical',
  className: 'col-12 col-lg-4 d-flex flex-column'
};

const defaultComponents = {
  FilterLabel,
  // FIXME: Should be a basic Filter not Field
  Filter: Field
};

export const FilterLayoutVerticalBase = ({ overrides, ...props }) => {
  const { FilterLabel, Filter } = useOverrides(defaultComponents, overrides);
  const { extractedProps, inheritedProps } = useFieldInheritedProps(
    props,
    INHERITED_PROP_OPTIONS
  );

  return (
    <FormGroup {...extractedProps} {...inheritedProps}>
      <FilterLabel {...inheritedProps} />
      <Filter {...inheritedProps} />
    </FormGroup>
  );
};

export const FilterLayoutVertical = (props) =>
  useGlobalComponent('FilterLayoutVertical', FilterLayoutVerticalBase, props);
