import classnames from 'classnames';
import { useMemo } from 'react';
import { Label } from 'reactstrap';
import { useFieldInheritedProps } from '@rhino-project/core/hooks';
import { useGlobalComponent, useOverrides } from '@rhino-project/core/hooks';

const INHERITED_PROP_PREFIX = 'filterLabel';

const defaultComponents = { FilterLabel: Label };

export const FilterLabelBase = ({ overrides, ...props }) => {
  const { FilterLabel } = useOverrides(defaultComponents, overrides);
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

export const FilterLabel = (props) =>
  useGlobalComponent('FilterLabel', FilterLabelBase, props);
