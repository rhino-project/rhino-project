import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import CellDate from '../../table/cells/CellDate';

export const ModelCellDateBase = (props) => <CellDate {...props} />;

export const ModelCellDate = (props) =>
  useGlobalComponentForAttribute('ModelCellDate', ModelCellDateBase, props);
