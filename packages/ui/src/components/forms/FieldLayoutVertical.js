import { FormGroup } from 'reactstrap';

import { useGlobalComponent, useOverrides } from '@rhino-project/core/hooks';
import { FieldLabel } from './FieldLabel';
import { FieldInput as Field } from './fields/FieldInput';
import { FieldFeedback } from './FieldFeedback';
import { useFieldInheritedProps } from '@rhino-project/core/hooks';

const INHERITED_PROP_OPTIONS = { prefix: 'FieldLayout' };

const defaultComponents = {
  FormGroup,
  FieldLabel,
  Field,
  FieldFeedback
};

export const FieldLayoutVerticalBase = ({
  overrides,
  labelHidden = false,
  ...props
}) => {
  const { FormGroup, FieldLabel, Field, FieldFeedback } = useOverrides(
    defaultComponents,
    overrides
  );
  const { extractedProps, inheritedProps } = useFieldInheritedProps(
    props,
    INHERITED_PROP_OPTIONS
  );

  return (
    <FormGroup {...extractedProps} {...inheritedProps}>
      <FieldLabel hidden={labelHidden} {...inheritedProps} />
      <Field {...inheritedProps} />
      <FieldFeedback {...inheritedProps} />
    </FormGroup>
  );
};

export const FieldLayoutVertical = (props) =>
  useGlobalComponent('FieldLayoutVertical', FieldLayoutVerticalBase, props);
