import { FormGroup } from 'reactstrap';

import { useGlobalOverrides } from 'rhino/hooks/overrides';
import Field from './fields/FieldInput';
import { useFieldInheritedProps } from 'rhino/hooks/form';
import FilterLabel from './FilterLabel';

const INHERITED_PROP_OPTIONS = {
  prefix: 'FilterLayoutVertical',
  className: 'col-12 col-lg-4 d-flex flex-column'
};

const defaultComponents = {
  FilterLabel,
  // FIXME: Should be a basic Filter not Field
  Filter: Field
};

export const FilterLayoutVertical = ({ overrides, ...props }) => {
  const { FilterLabel, Filter } = useGlobalOverrides(
    defaultComponents,
    overrides
  );
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

export default FilterLayoutVertical;
