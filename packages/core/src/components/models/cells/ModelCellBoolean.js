import CellBoolean from 'rhino/components/table/cells/CellBoolean';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';

export const ModelCellBooleanBase = (props) => <CellBoolean {...props} />;

const ModelCellBoolean = (props) =>
  useGlobalComponentForAttribute(
    'ModelCellBoolean',
    ModelCellBooleanBase,
    props
  );

export default ModelCellBoolean;
