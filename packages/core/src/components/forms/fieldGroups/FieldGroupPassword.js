import FieldGroup from '../FieldGroup';
import FieldPassword from '../fields/FieldPassword';

export const FieldGroupPassword = (props) => (
  <FieldGroup
    overrides={{ FieldLayout: { Field: FieldPassword } }}
    {...props}
  />
);

export default FieldGroupPassword;
