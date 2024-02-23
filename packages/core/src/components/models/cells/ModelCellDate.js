import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import CellDate from 'rhino/components/table/cells/CellDate';

export const ModelCellDateBase = (props) => <CellDate {...props} />;

const ModelCellDate = (props) =>
  useGlobalComponentForAttribute('ModelCellDate', ModelCellDateBase, props);

export default ModelCellDate;
