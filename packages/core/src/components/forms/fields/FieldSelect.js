import { useGlobalComponent } from '../../../hooks/overrides';
import { FieldInputBase } from './FieldInput';

export const FieldSelectBase = (props) => (
  <FieldInputBase type="select" {...props} />
);

const FieldSelect = (props) =>
  useGlobalComponent('FieldSelect', FieldSelectBase, props);

export default FieldSelect;
