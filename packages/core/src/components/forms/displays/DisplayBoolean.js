import { useGlobalComponent } from '../../../hooks/overrides';
import FieldBooleanIndeterminate from '../fields/FieldBooleanIndeterminate';

export const DisplayBooleanBase = (props) => (
  <FieldBooleanIndeterminate readOnly {...props} />
);

const DisplayBoolean = (props) =>
  useGlobalComponent('DisplayBoolean', DisplayBooleanBase, props);

export default DisplayBoolean;
