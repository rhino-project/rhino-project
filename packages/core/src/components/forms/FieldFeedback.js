import { FormFeedback } from 'reactstrap';

import { useFieldError, useFieldInheritedProps } from 'rhino/hooks/form';
import { useGlobalComponent, useOverrides } from 'rhino/hooks/overrides';

const INHERITED_PROP_OPTIONS = { prefix: 'fieldFeedback' };

const defaultComponents = { FieldFeedback: FormFeedback };

export const FieldFeedbackBase = ({ overrides, ...props }) => {
  const { FieldFeedback } = useOverrides(defaultComponents, overrides);
  const { extractedProps, inheritedProps } = useFieldInheritedProps(
    props,
    INHERITED_PROP_OPTIONS
  );
  const error = useFieldError(inheritedProps.path);

  if (!error) return null;

  return (
    <FieldFeedback {...extractedProps} {...inheritedProps}>
      {error.message}
    </FieldFeedback>
  );
};

const FieldFeedback = (props) =>
  useGlobalComponent('FieldFeedback', FieldFeedbackBase, props);

export default FieldFeedback;
