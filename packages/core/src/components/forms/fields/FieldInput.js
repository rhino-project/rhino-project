import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

import {
  useFieldError,
  useFieldRegister,
  useFieldInheritedProps
} from '../../../hooks/form';
import { useGlobalComponent } from '../../../hooks/overrides';

// FIXME: Is there a better way to handle setValueAs?
export const FieldInputBase = ({ setValueAs, ...props }) => {
  const { extractedProps, inheritedProps } = useFieldInheritedProps(props);
  const { path } = props;

  // https://github.com/react-hook-form/react-hook-form/issues/4414
  // FIXME: All registration props could be extracted in useFieldInheritedProps
  const { ref, ...fieldProps } = useFieldRegister(path, { setValueAs });
  // FIXME: I should be able to get the error from the fieldProps/form context
  const error = useFieldError(path);

  return (
    <Input
      {...extractedProps}
      {...fieldProps}
      innerRef={ref}
      autoComplete="off"
      invalid={!!error}
      {...inheritedProps}
    />
  );
};

FieldInputBase.propTypes = {
  path: PropTypes.string.isRequired
};

export const FieldInput = (props) =>
  useGlobalComponent('FieldInput', FieldInputBase, props);
