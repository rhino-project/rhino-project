import {
  useGlobalComponent,
  useMergedOverrides,
  useOverrides
} from '../../../hooks/overrides';
import { FieldLayoutVertical } from '../FieldLayoutVertical';
import { FieldCurrency } from '../fields/FieldCurrency';
import { FieldLayoutHorizontal } from '../FieldLayoutHorizontal';
import classnames from 'classnames';
import { FormGroup, InputGroup } from 'reactstrap';
import { useFieldError, useFieldInheritedProps } from '../../../hooks/form';
import { FieldLabel } from '../FieldLabel';
import { FieldFeedback } from '../FieldFeedback';
import { FieldCurrencyBaseInput } from '../fields/FieldCurrency';

const BASE_OVERRIDES = {
  Field: FieldCurrency
};

export const FieldGroupCurrencyBase = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldLayoutVertical overrides={mergedOverrides} {...props} />;
};

export const FieldGroupHorizontalCurrency = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldLayoutHorizontal overrides={mergedOverrides} {...props} />;
};

// Currency for floating must be handled specially because of boostrap input groups
// https://getbootstrap.com/docs/5.3/forms/floating-labels/#input-groups
const INHERITED_PROP_OPTIONS = { prefix: 'FieldGroupFloatingCurrency' };

const defaultComponents = {
  FormGroup,
  FieldLabel,
  Field: FieldCurrencyBaseInput,
  FieldFeedback
};

export const FieldGroupFloatingCurrency = ({ overrides, ...props }) => {
  const { FormGroup, FieldLabel, Field, FieldFeedback } = useOverrides(
    defaultComponents,
    overrides
  );
  const { path } = props;

  const { extractedProps, inheritedProps } = useFieldInheritedProps(
    props,
    INHERITED_PROP_OPTIONS
  );

  const error = useFieldError(path);

  return (
    <FormGroup {...extractedProps} {...inheritedProps}>
      <InputGroup
        className={classnames({
          'is-invalid': error
        })}
      >
        <span className="input-group-text">$</span>
        <div className="form-floating">
          <Field {...inheritedProps} />
          <FieldLabel {...inheritedProps} />
        </div>
      </InputGroup>
      <FieldFeedback {...inheritedProps} />
    </FormGroup>
  );
};

export const FieldGroupCurrency = (props) =>
  useGlobalComponent('FieldGroupCurrency', FieldGroupCurrencyBase, props);
