import { FormGroup } from 'reactstrap';

import { useGlobalComponent, useOverrides } from '../../hooks/overrides';
import { FieldInput as Field } from './fields/FieldInput';
import { useFieldInheritedProps } from '../../hooks/form';
import { DisplayLabel } from './DisplayLabel';

const INHERITED_PROP_OPTIONS = { prefix: 'DisplayLayout' };

const defaultComponents = {
  FormGroup,
  DisplayLabel,
  // FIXME: Should be a basic Display not Field
  Display: Field
};

export const DisplayLayoutVerticalBase = ({
  overrides,
  labelHidden = false,
  ...props
}) => {
  const { FormGroup, DisplayLabel, Display } = useOverrides(
    defaultComponents,
    overrides
  );

  const { extractedProps, inheritedProps } = useFieldInheritedProps(
    props,
    INHERITED_PROP_OPTIONS
  );

  return (
    <FormGroup {...extractedProps} {...inheritedProps}>
      <DisplayLabel hidden={labelHidden} {...inheritedProps} />
      <Display {...inheritedProps} />
    </FormGroup>
  );
};

export const DisplayLayoutVertical = (props) =>
  useGlobalComponent('DisplayLayoutVertical', DisplayLayoutVerticalBase, props);
