import { useGlobalComponent } from 'rhino/hooks/overrides';
import CellInteger from 'rhino/components/table/cells/CellInteger';

export const ModelCellIntegerBase = (props) => <CellInteger {...props} />;

const ModelCellInteger = (props) =>
  useGlobalComponent('ModelCellInteger', ModelCellIntegerBase, props);

export default ModelCellInteger;
