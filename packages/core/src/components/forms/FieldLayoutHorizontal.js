import { Col, FormGroup } from 'reactstrap';

import { useGlobalComponent, useOverrides } from '../../hooks/overrides';
import { FieldLabel } from './FieldLabel';
import { Field } from './fields/FieldInput';
import { FieldFeedback } from './FieldFeedback';
import { useFieldInheritedProps } from '../../hooks/form';

const INHERITED_PROP_OPTIONS = { prefix: 'FieldLayoutHorizontal' };

const defaultComponents = {
  FormGroup,
  FieldLabel,
  Field,
  FieldFeedback
};

export const FieldLayoutHorizontalBase = ({ overrides, ...props }) => {
  const { FormGroup, FieldLabel, Field, FieldFeedback } = useOverrides(
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

export const FieldLayoutHorizontal = (props) =>
  useGlobalComponent('FieldLayoutHorizontal', FieldLayoutHorizontalBase, props);
