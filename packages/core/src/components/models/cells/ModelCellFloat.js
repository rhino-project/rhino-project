import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import CellFloat from 'rhino/components/table/cells/CellFloat';

export const ModelCellFloatBase = (props) => <CellFloat {...props} />;

const ModelCellFloat = (props) =>
  useGlobalComponentForAttribute('ModelCellFloat', ModelCellFloatBase, props);

export default ModelCellFloat;
