import classnames from 'classnames';
import { useMemo } from 'react';
import { Label } from 'reactstrap';
import { useFieldInheritedProps } from 'rhino/hooks/form';
import { useGlobalComponent, useOverrides } from 'rhino/hooks/overrides';

const INHERITED_PROP_PREFIX = 'displayLabel';

const defaultComponents = { DisplayLabel: Label };

export const DisplayLabelBase = ({ overrides, ...props }) => {
  const { DisplayLabel } = useOverrides(defaultComponents, overrides);
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
    <DisplayLabel {...extractedProps} for={path} checked {...inheritedProps}>
      {label}
    </DisplayLabel>
  );
};

const DisplayLabel = (props) =>
  useGlobalComponent('DisplayLabel', DisplayLabelBase, props);

export default DisplayLabel;
