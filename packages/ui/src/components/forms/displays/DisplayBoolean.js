import { useGlobalComponent } from '@rhino-project/core/hooks';
import { FieldBooleanIndeterminate } from '../fields/FieldBooleanIndeterminate';

export const DisplayBooleanBase = (props) => (
  <FieldBooleanIndeterminate readOnly {...props} />
);

export const DisplayBoolean = (props) =>
  useGlobalComponent('DisplayBoolean', DisplayBooleanBase, props);
