import { useGlobalComponentForAttribute } from '@rhino-project/core/hooks';
import { CellFloat } from '../../table/cells/CellFloat';

export const ModelCellFloatBase = (props) => <CellFloat {...props} />;

export const ModelCellFloat = (props) =>
  useGlobalComponentForAttribute('ModelCellFloat', ModelCellFloatBase, props);
