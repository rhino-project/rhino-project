import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import CellTime from 'rhino/components/table/cells/CellTime';

export const ModelCellTimeBase = (props) => <CellTime {...props} />;

const ModelCellTime = (props) =>
  useGlobalComponentForAttribute('ModelCellTime', ModelCellTimeBase, props);

export default ModelCellTime;
