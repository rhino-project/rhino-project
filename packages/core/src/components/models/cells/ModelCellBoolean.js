import { CellBoolean } from '../../table/cells/CellBoolean';
import { useGlobalComponentForAttribute } from '../../../hooks/overrides';

export const ModelCellBooleanBase = (props) => <CellBoolean {...props} />;

export const ModelCellBoolean = (props) =>
  useGlobalComponentForAttribute(
    'ModelCellBoolean',
    ModelCellBooleanBase,
    props
  );
