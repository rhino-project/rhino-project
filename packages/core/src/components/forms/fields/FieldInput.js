import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

import {
  useFieldError,
  useFieldPlaceholder,
  useFieldRegister,
  useFieldInheritedProps
} from 'rhino/hooks/form';

const FieldInput = (props) => {
  const { extractedProps, inheritedProps } = useFieldInheritedProps(props);
  const { path } = inheritedProps;

  // https://github.com/react-hook-form/react-hook-form/issues/4414
  const { ref, ...fieldProps } = useFieldRegister(path);
  const error = useFieldError(path);

  const placeholder = useFieldPlaceholder(props);

  return (
    <Input
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
