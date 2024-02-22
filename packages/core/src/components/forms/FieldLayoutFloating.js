import { FormGroup } from 'reactstrap';

import { useGlobalComponent, useOverrides } from '../../hooks/overrides';
import FieldLabel from './FieldLabel';
import Field from './fields/FieldInput';
import FieldFeedback from './FieldFeedback';
import { useFieldInheritedProps } from '../../hooks/form';

const INHERITED_PROP_OPTIONS = { prefix: 'FieldLayoutFloating' };

const defaultComponents = {
  FormGroup,
  FieldLabel,
  Field,
  FieldFeedback
};

export const FieldLayoutFloatingBase = ({ overrides, ...props }) => {
  const { FormGroup, FieldLabel, Field, FieldFeedback } = useOverrides(
    defaultComponents,
    overrides
  );

  const { extractedProps, inheritedProps } = useFieldInheritedProps(
    props,
    INHERITED_PROP_OPTIONS
  );

  return (
    <FormGroup floating {...extractedProps} {...inheritedProps}>
      <Field {...inheritedProps} />
      <FieldLabel {...inheritedProps} />
      <FieldFeedback {...inheritedProps} />
    </FormGroup>
  );
};

const FieldLayoutFloating = (props) =>
  useGlobalComponent('FieldLayoutFloating', FieldLayoutFloatingBase, props);

export default FieldLayoutFloating;
