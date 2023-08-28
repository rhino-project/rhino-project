import { FormGroup } from 'reactstrap';

import { useGlobalComponent, useOverrides } from 'rhino/hooks/overrides';
import Field from './fields/FieldInput';
import { useFieldInheritedProps } from 'rhino/hooks/form';
import DisplayLabel from './DisplayLabel';

const INHERITED_PROP_OPTIONS = { prefix: 'DisplayLayoutVertical' };

const defaultComponents = {
  FormGroup,
  DisplayLabel,
  // FIXME: Should be a basic Display not Field
  Display: Field
};

export const DisplayLayoutVerticalBase = ({ overrides, ...props }) => {
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
      <DisplayLabel {...inheritedProps} />
      <Display {...inheritedProps} />
    </FormGroup>
  );
};

const DisplayLayoutVertical = (props) =>
  useGlobalComponent('DisplayLayoutVertical', DisplayLayoutVerticalBase, props);

export default DisplayLayoutVertical;
