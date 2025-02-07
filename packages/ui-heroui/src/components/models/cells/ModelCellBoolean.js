import { CellBoolean } from '../../table/cells/CellBoolean';
import { useGlobalComponentForAttribute } from '@rhino-project/core/hooks';
export const ModelCellBooleanBase = (props) => <CellBoolean {...props} />;

export const ModelCellBoolean = (props) =>
  useGlobalComponentForAttribute(
    'ModelCellBoolean',
    ModelCellBooleanBase,
    props
  );
