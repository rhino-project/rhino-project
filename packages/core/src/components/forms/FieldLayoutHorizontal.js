import { FormGroup, Col } from 'reactstrap';

import { useOverrides } from 'rhino/hooks/overrides';
import FieldLabel from './FieldLabel';
import Field from './fields/FieldInput';
import FieldFeedback from './FieldFeedback';
import { useFieldInheritedProps } from 'rhino/hooks/form';

const INHERITED_PROP_OPTIONS = { prefix: 'FieldLayoutHorizontal' };

const defaultComponents = {
  FieldLabel,
  Field,
  FieldFeedback
};

export const FieldLayoutHorizontal = ({ overrides, ...props }) => {
  const { FieldLabel, Field, FieldFeedback } = useOverrides(
    defaultComponents,
    overrides
  );

  const { extractedProps, inheritedProps } = useFieldInheritedProps(
    props,
    INHERITED_PROP_OPTIONS
  );

  return (
    <FormGroup {...extractedProps} row {...inheritedProps}>
      <FieldLabel sm={2} {...inheritedProps} />
      <Col>
        <Field {...inheritedProps} />
        <FieldFeedback {...inheritedProps} />
      </Col>
    </FormGroup>
  );
};

export default FieldLayoutHorizontal;
