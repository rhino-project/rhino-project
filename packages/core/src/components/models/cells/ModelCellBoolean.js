import CellBoolean from '../../table/cells/CellBoolean';
import { useGlobalComponentForAttribute } from '../../../hooks/overrides';

export const ModelCellBooleanBase = (props) => <CellBoolean {...props} />;

const ModelCellBoolean = (props) =>
  useGlobalComponentForAttribute(
    'ModelCellBoolean',
    ModelCellBooleanBase,
    props
  );

export default ModelCellBoolean;
