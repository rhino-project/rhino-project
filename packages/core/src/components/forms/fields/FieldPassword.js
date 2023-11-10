import { FieldInputBase } from './FieldInput';
import { IconButton } from '../../buttons';
import { useState } from 'react';
import { InputGroup } from 'reactstrap';
import { useGlobalComponent } from 'rhino/hooks/overrides';

export const FieldPasswordBase = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <InputGroup>
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
