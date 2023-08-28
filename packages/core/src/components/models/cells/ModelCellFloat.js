import { useGlobalComponent } from 'rhino/hooks/overrides';
import CellFloat from 'rhino/components/table/cells/CellFloat';

export const ModelCellFloatBase = (props) => <CellFloat {...props} />;

const ModelCellFloat = (props) =>
  useGlobalComponent('ModelCellFloat', ModelCellFloatBase, props);

export default ModelCellFloat;
