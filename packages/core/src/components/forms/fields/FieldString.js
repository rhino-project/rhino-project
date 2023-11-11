import { useGlobalComponent } from 'rhino/hooks/overrides';
import { FieldInputBase } from './FieldInput';

export const FieldStringBase = (props) => (
  <FieldInputBase type="text" {...props} />
);

const FieldString = (props) =>
  useGlobalComponent('FieldString', FieldStringBase, props);

export default FieldString;
