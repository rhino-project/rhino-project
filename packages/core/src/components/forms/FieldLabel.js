import classnames from 'classnames';
import { useMemo } from 'react';
import { Label } from 'reactstrap';
import { useFieldInheritedProps } from 'rhino/hooks/form';

const INHERITED_PROP_PREFIX = 'fieldLabel';

// FIXME: Is mark as checked required? This is legacy
export const FieldLabel = (props) => {
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
    <Label {...extractedProps} for={path} checked {...inheritedProps}>
      {label}
    </Label>
  );
};

export default FieldLabel;
