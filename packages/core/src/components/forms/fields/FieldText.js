import { useGlobalComponent } from '../../../hooks/overrides';
import { FieldInputBase } from './FieldInput';

export const FieldTextBase = (props) => (
  <FieldInputBase type="textarea" {...props} />
);

export const FieldText = (props) =>
  useGlobalComponent('FieldText', FieldTextBase, props);
