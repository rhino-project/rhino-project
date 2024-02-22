import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import CellTime from '../../table/cells/CellTime';

export const ModelCellTimeBase = (props) => <CellTime {...props} />;

const ModelCellTime = (props) =>
  useGlobalComponentForAttribute('ModelCellTime', ModelCellTimeBase, props);

export default ModelCellTime;
