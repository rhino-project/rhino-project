import { useGlobalComponent } from '../../../hooks/overrides';
import { FieldInputBase } from './FieldInput';

export const FieldTextBase = (props) => (
  <FieldInputBase type="textarea" {...props} />
);

const FieldText = (props) =>
  useGlobalComponent('FieldText', FieldTextBase, props);

export default FieldText;
