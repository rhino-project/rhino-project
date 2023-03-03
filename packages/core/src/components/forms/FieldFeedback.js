import { FormFeedback } from 'reactstrap';

import { useFieldError, useFieldInheritedProps } from 'rhino/hooks/form';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

const INHERITED_PROP_OPTIONS = { prefix: 'fieldFeedback' };

const defaultComponents = { FieldFeedback: FormFeedback };

export const FieldFeedback = ({ overrides, ...props }) => {
  const { FieldFeedback } = useGlobalOverrides(defaultComponents, overrides);
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

export default FieldFeedback;
