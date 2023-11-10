import { useGlobalComponent } from 'rhino/hooks/overrides';
import { FieldInputControlledBase } from '../fields/FieldInputControlled';

export const DisplayStringControlledBase = (props) => (
  <FieldInputControlledBase type="text" readOnly {...props} />
);

const DisplayStringControlled = (props) =>
  useGlobalComponent(
    'DisplayStringControlled',
    DisplayStringControlledBase,
    props
  );

export default DisplayStringControlled;
