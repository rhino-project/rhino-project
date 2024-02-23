import classnames from 'classnames';
import { useMemo } from 'react';
import { Label } from 'reactstrap';
import { useFieldInheritedProps } from '../../hooks/form';
import { useGlobalComponent } from '../../hooks/overrides';

const INHERITED_PROP_PREFIX = 'displayLabel';

export const DisplayLabelBase = ({ label, ...props }) => {
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

  return (
    <Label {...extractedProps} for={path} checked {...inheritedProps}>
      {label}
    </Label>
  );
};

export const DisplayLabel = (props) =>
  useGlobalComponent('DisplayLabel', DisplayLabelBase, props);
