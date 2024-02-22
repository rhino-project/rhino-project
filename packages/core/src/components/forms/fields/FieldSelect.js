import { useGlobalComponent } from '../../../hooks/overrides';
import { FieldInputBase } from './FieldInput';

export const FieldSelectBase = (props) => (
  <FieldInputBase type="select" {...props} />
);

export const FieldSelect = (props) =>
  useGlobalComponent('FieldSelect', FieldSelectBase, props);
