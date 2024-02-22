import {
  useGlobalComponent,
  useMergedOverrides,
  useOverrides
} from 'rhino/hooks/overrides';
import FieldLayoutVertical from '../FieldLayoutVertical';
import FieldPassword from '../fields/FieldPassword';
import FieldLayoutHorizontal from '../FieldLayoutHorizontal';
import classnames from 'classnames';
import { FormGroup, InputGroup } from 'reactstrap';
import { useFieldError, useFieldInheritedProps } from 'rhino/hooks/form';
import FieldLabel from '../FieldLabel';
import FieldFeedback from '../FieldFeedback';
import { FieldPasswordBaseInput } from '../fields/FieldPassword';
import { IconButton } from 'rhino/components/buttons';
import { useState } from 'react';

const BASE_OVERRIDES = {
  Field: FieldPassword
};

export const FieldGroupPasswordBase = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldLayoutVertical overrides={mergedOverrides} {...props} />;
};

export const FieldGroupHorizontalPassword = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldLayoutHorizontal overrides={mergedOverrides} {...props} />;
};

const INHERITED_PROP_OPTIONS = { prefix: 'FieldGroupFloatingPassword' };

const defaultComponents = {
  FormGroup,
  FieldLabel,
  Field: FieldPasswordBaseInput,
  FieldFeedback
};

export const FieldGroupFloatingPassword = ({ overrides, ...props }) => {
  const { FormGroup, FieldLabel, Field, FieldFeedback } = useOverrides(
    defaultComponents,
    overrides
  );
  const { path } = props;
  const [showPassword, setShowPassword] = useState(false);

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
        <div className="form-floating">
          <Field showPassword={showPassword} {...inheritedProps} />
          <FieldLabel {...inheritedProps} />
        </div>
        <IconButton
          icon={showPassword ? 'eye-slash-fill' : 'eye-fill'}
          color="outline-secondary"
          onClick={() => setShowPassword((show) => !show)}
          className="password-eye-toggle"
        />
      </InputGroup>
      <FieldFeedback {...inheritedProps} />
    </FormGroup>
  );
};

const FieldGroupPassword = (props) =>
  useGlobalComponent('FieldGroupPassword', FieldGroupPasswordBase, props);

export default FieldGroupPassword;
