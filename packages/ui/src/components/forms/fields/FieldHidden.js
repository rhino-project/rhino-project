import { useGlobalComponent } from '@rhino-project/core/hooks';
import { FieldInputBase } from './FieldInput';

export const FieldHiddenBase = (props) => (
  <FieldInputBase type="hidden" {...props} />
);

export const FieldHidden = (props) =>
  useGlobalComponent('FieldHidden', FieldHiddenBase, props);
