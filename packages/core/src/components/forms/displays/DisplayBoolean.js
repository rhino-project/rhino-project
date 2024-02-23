import { useGlobalComponent } from '../../../hooks/overrides';
import FieldBooleanIndeterminate from '../fields/FieldBooleanIndeterminate';

export const DisplayBooleanBase = (props) => (
  <FieldBooleanIndeterminate readOnly {...props} />
);

export const DisplayBoolean = (props) =>
  useGlobalComponent('DisplayBoolean', DisplayBooleanBase, props);
