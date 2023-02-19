import classnames from 'classnames';
import { useMemo } from 'react';
import { Label } from 'reactstrap';
import { useFieldInheritedProps } from 'rhino/hooks/form';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

const INHERITED_PROP_PREFIX = 'filterLabel';

const defaultComponents = { FilterLabel: Label };

export const FilterLabel = ({ overrides, ...props }) => {
  const { FilterLabel } = useGlobalOverrides(defaultComponents, overrides);
  const { required } = props;
  const inheritedPropsOptions = useMemo(
    () => ({
      prefix: INHERITED_PROP_PREFIX,
      className: classnames({ required })
    }),
    [required]
  );
  const { extractedProps, inheritedProps } = useFieldInheritedProps(
    props,
    inheritedPropsOptions
  );
  const { label, path } = inheritedProps;

  return (
    <FilterLabel {...extractedProps} for={path} checked {...inheritedProps}>
      {label}
    </FilterLabel>
  );
};

export default FilterLabel;
