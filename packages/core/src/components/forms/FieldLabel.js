import classnames from 'classnames';
import { useMemo } from 'react';
import { Label } from 'reactstrap';
import { useFieldInheritedProps } from 'rhino/hooks/form';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

const INHERITED_PROP_PREFIX = 'fieldLabel';

const defaultComponents = { FieldLabel: Label };

// FIXME: Is mark as checked required? This is legacy
export const FieldLabel = ({ overrides, ...props }) => {
  const { FieldLabel } = useGlobalOverrides(defaultComponents, overrides);
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
    <FieldLabel {...extractedProps} for={path} checked {...inheritedProps}>
      {label}
    </FieldLabel>
  );
};

export default FieldLabel;
