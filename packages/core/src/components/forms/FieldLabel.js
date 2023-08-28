import classnames from 'classnames';
import { useMemo } from 'react';
import { Label } from 'reactstrap';
import { useFieldInheritedProps } from 'rhino/hooks/form';
import { useGlobalComponent, useOverrides } from 'rhino/hooks/overrides';

const INHERITED_PROP_PREFIX = 'fieldLabel';

const defaultComponents = { FieldLabel: Label };

export const FieldLabelBase = ({ overrides, ...props }) => {
  const { FieldLabel } = useOverrides(defaultComponents, overrides);
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

  // FIXME: Is mark as checked required? This is legacy
  return (
    <FieldLabel {...extractedProps} for={path} checked {...inheritedProps}>
      {label}
    </FieldLabel>
  );
};

const FieldLabel = (props) =>
  useGlobalComponent('FieldLabel', FieldLabelBase, props);

export default FieldLabel;
