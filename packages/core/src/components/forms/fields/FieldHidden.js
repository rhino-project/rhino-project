import { useGlobalComponent } from 'rhino/hooks/overrides';
import { FieldInputBase } from './FieldInput';

export const FieldHiddenBase = (props) => (
  <FieldInputBase type="hidden" {...props} />
);

const FieldHidden = (props) =>
  useGlobalComponent('FieldHidden', FieldHiddenBase, props);

export default FieldHidden;
