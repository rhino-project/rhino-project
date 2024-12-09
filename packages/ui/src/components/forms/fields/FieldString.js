import { useGlobalComponent } from '@rhino-project/core/hooks';
import { FieldInputBase } from './FieldInput';

export const FieldStringBase = (props) => (
  <FieldInputBase type="text" {...props} />
);

export const FieldString = (props) =>
  useGlobalComponent('FieldString', FieldStringBase, props);
