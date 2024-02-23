import { FormGroup } from 'reactstrap';

import { useGlobalComponent, useOverrides } from '../../hooks/overrides';
import FieldLabel from './FieldLabel';
import Field from './fields/FieldInput';
import FieldFeedback from './FieldFeedback';
import { useFieldInheritedProps } from '../../hooks/form';

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
