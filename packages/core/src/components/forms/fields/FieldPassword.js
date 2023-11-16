import { FieldInputBase } from './FieldInput';
import classnames from 'classnames';
import { IconButton } from '../../buttons';
import { useState } from 'react';
import { InputGroup } from 'reactstrap';
import { useGlobalComponent } from 'rhino/hooks/overrides';
import { useFieldError } from 'rhino/hooks/form';

export const FieldPasswordBase = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const error = useFieldError(props.path);

  return (
    <InputGroup
      className={classnames({
        'is-invalid': error
      })}
    >
      <FieldInputBase type={showPassword ? 'text' : 'password'} {...props} />
      <IconButton
        icon={showPassword ? 'eye-slash-fill' : 'eye-fill'}
        color="outline-secondary"
        onClick={() => setShowPassword((show) => !show)}
        className="password-eye-toggle"
      />
    </InputGroup>
  );
};

const FieldPassword = (props) =>
  useGlobalComponent('FieldPassword', FieldPasswordBase, props);

export default FieldPassword;
