import FieldInput from './FieldInput';
import { IconButton } from '../../buttons';
import { useState } from 'react';
import { InputGroup } from 'reactstrap';

export const FieldPassword = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <InputGroup>
      <FieldInput type={showPassword ? 'text' : 'password'} {...props} />
      <IconButton
        icon={showPassword ? 'eye-slash-fill' : 'eye-fill'}
        color="outline-secondary"
        onClick={() => setShowPassword((show) => !show)}
        className="password-eye-toggle"
      />
    </InputGroup>
  );
};

export default FieldPassword;
