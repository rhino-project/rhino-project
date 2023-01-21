import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

import {
  useFieldError,
  useFieldPlaceholder,
  useFieldRegister,
  useFieldInheritedProps
} from 'rhino/hooks/form';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

const defaultComponents = { FieldInput: Input };

const FieldInput = ({ overrides, ...props }) => {
  const { FieldInput } = useGlobalOverrides(defaultComponents, overrides);
  const { extractedProps, inheritedProps } = useFieldInheritedProps(props);
  const { path } = inheritedProps;

  // https://github.com/react-hook-form/react-hook-form/issues/4414
  const { ref, ...fieldProps } = useFieldRegister(path);
  const error = useFieldError(path);

  const placeholder = useFieldPlaceholder(props);

  return (
    <FieldInput
      {...extractedProps}
      {...fieldProps}
      innerRef={ref}
      autoComplete="off"
      invalid={!!error}
      placeholder={placeholder}
      {...inheritedProps}
    />
  );
};

FieldInput.propTypes = {
  path: PropTypes.string.isRequired
};

export default FieldInput;
