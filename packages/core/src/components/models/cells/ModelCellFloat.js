import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import { CellFloat } from '../../table/cells/CellFloat';

export const ModelCellFloatBase = (props) => <CellFloat {...props} />;

export const ModelCellFloat = (props) =>
  useGlobalComponentForAttribute('ModelCellFloat', ModelCellFloatBase, props);
