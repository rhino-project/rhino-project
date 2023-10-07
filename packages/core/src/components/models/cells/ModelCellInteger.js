import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import CellInteger from 'rhino/components/table/cells/CellInteger';

export const ModelCellIntegerBase = (props) => <CellInteger {...props} />;

const ModelCellInteger = (props) =>
  useGlobalComponentForAttribute(
    'ModelCellInteger',
    ModelCellIntegerBase,
    props
  );

export default ModelCellInteger;
