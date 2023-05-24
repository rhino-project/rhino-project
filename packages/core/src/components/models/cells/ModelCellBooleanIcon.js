import CellBooleanIcon from 'rhino/components/table/cells/CellBooleanIcon';
import { useGlobalComponent } from 'rhino/hooks/overrides';

export const ModelCellBooleanIconBase = (props) => (
  <CellBooleanIcon {...props} />
);

const ModelCellBooleanIcon = (props) =>
  useGlobalComponent('ModelCellBooleanIcon', ModelCellBooleanIconBase, props);

export default ModelCellBooleanIcon;
