import { FormGroup } from 'reactstrap';

import { useGlobalOverrides } from 'rhino/hooks/overrides';
import Field from './fields/FieldInput';
import { useFieldInheritedProps } from 'rhino/hooks/form';
import DisplayLabel from './DisplayLabel';

const INHERITED_PROP_OPTIONS = { prefix: 'DisplayLayoutVertical' };

const defaultComponents = {
  DisplayLabel,
  // FIXME: Should be a basic Display not Field
  Display: Field
};

export const DisplayLayoutVertical = ({ overrides, ...props }) => {
  const { DisplayLabel, Display } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
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

export default DisplayLayoutVertical;
