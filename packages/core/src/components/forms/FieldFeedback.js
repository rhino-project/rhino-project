import { FormFeedback } from 'reactstrap';

import { useFieldError, useFieldInheritedProps } from '../../hooks/form';
import { useGlobalComponent } from '../../hooks/overrides';

const INHERITED_PROP_OPTIONS = { prefix: 'fieldFeedback' };

export const FieldFeedbackBase = (props) => {
  const { extractedProps, inheritedProps } = useFieldInheritedProps(
    props,
    INHERITED_PROP_OPTIONS
  );
  const error = useFieldError(inheritedProps.path);

  if (!error) return null;

  return (
    <FormFeedback {...extractedProps} {...inheritedProps}>
      {error.message}
    </FormFeedback>
  );
};

export const FieldFeedback = (props) =>
  useGlobalComponent('FieldFeedback', FieldFeedbackBase, props);
