import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import CellString from '../../table/cells/CellString';

export const ModelCellStringBase = (props) => <CellString {...props} />;

const ModelCellString = (props) =>
  useGlobalComponentForAttribute('ModelCellString', ModelCellStringBase, props);

export default ModelCellString;
