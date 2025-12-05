import { useGlobalComponent } from '@rhino-project/core/hooks';
import { FieldInputControlledBase } from '../fields/FieldInputControlled';

export const DisplayStringControlledBase = (props) => (
  <FieldInputControlledBase type="text" readOnly {...props} />
);

export const DisplayStringControlled = (props) =>
  useGlobalComponent(
    'DisplayStringControlled',
    DisplayStringControlledBase,
    props
  );
