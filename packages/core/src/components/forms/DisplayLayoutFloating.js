import { FormGroup } from 'reactstrap';

import { useGlobalComponent, useOverrides } from '../../hooks/overrides';
import { Field } from './fields/FieldInput';
import { useFieldInheritedProps } from '../../hooks/form';
import { DisplayLabel } from './DisplayLabel';

const INHERITED_PROP_OPTIONS = { prefix: 'DisplayLayoutFloating' };

const defaultComponents = {
  FormGroup,
  DisplayLabel,
  // FIXME: Should be a basic Display not Field
  Display: Field
};

export const DisplayLayoutFloatingBase = ({ overrides, ...props }) => {
  const { FormGroup, DisplayLabel, Display } = useOverrides(
    defaultComponents,
    overrides
  );

  const { extractedProps, inheritedProps } = useFieldInheritedProps(
    props,
    INHERITED_PROP_OPTIONS
  );

  return (
    <FormGroup floating {...extractedProps} {...inheritedProps}>
      <Display plaintext {...inheritedProps} />
      <DisplayLabel {...inheritedProps} />
    </FormGroup>
  );
};

export const DisplayLayoutFloating = (props) =>
  useGlobalComponent('DisplayLayoutFloating', DisplayLayoutFloatingBase, props);
