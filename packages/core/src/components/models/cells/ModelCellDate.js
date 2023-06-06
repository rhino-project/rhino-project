import { useGlobalComponent } from 'rhino/hooks/overrides';
import CellDate from 'rhino/components/table/cells/CellDate';

export const ModelCellDateBase = (props) => <CellDate {...props} />;

const ModelCellDate = (props) =>
  useGlobalComponent('ModelCellDate', ModelCellDateBase, props);

export default ModelCellDate;
