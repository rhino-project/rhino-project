import classnames from 'classnames';
import { useMemo } from 'react';
import { Label } from 'reactstrap';
import { useFieldInheritedProps } from 'rhino/hooks/form';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

const INHERITED_PROP_PREFIX = 'displayLabel';

const defaultComponents = { DisplayLabel: Label };

export const DisplayLabel = ({ overrides, ...props }) => {
  const { DisplayLabel } = useGlobalOverrides(defaultComponents, overrides);
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

export default DisplayLabel;
