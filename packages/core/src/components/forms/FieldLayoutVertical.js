import { FormGroup } from 'reactstrap';

import { useOverrides } from 'rhino/hooks/overrides';
import FieldLabel from './FieldLabel';
import Field from './fields/FieldInput';
import FieldFeedback from './FieldFeedback';
import { useFieldInheritedProps } from 'rhino/hooks/form';

const INHERITED_PROP_OPTIONS = { prefix: 'FieldLayoutVertical' };

const defaultComponents = {
  FieldLabel,
  Field,
  FieldFeedback
};

export const FieldLayoutVertical = ({ overrides, ...props }) => {
  const { FieldLabel, Field, FieldFeedback } = useOverrides(
    defaultComponents,
    overrides
  );

  const { extractedProps, inheritedProps } = useFieldInheritedProps(
    props,
    INHERITED_PROP_OPTIONS
  );

  return (
    <FormGroup {...extractedProps} {...inheritedProps}>
      <FieldLabel {...inheritedProps} />
      <Field {...inheritedProps} />
      <FieldFeedback {...inheritedProps} />
    </FormGroup>
  );
};

export default FieldLayoutVertical;
