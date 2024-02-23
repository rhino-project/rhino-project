import classnames from 'classnames';
import { useMemo } from 'react';
import { Label } from 'reactstrap';
import { useFieldInheritedProps } from '../../hooks/form';
import { useGlobalComponent } from '../../hooks/overrides';

const INHERITED_PROP_PREFIX = 'fieldLabel';

export const FieldLabelBase = ({ label, ...props }) => {
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
  const { path } = inheritedProps;

  if (!label) return null;

  return (
    <Label {...extractedProps} htmlFor={path} {...inheritedProps}>
      {label}
    </Label>
  );
};

export const FieldLabel = (props) =>
  useGlobalComponent('FieldLabel', FieldLabelBase, props);
