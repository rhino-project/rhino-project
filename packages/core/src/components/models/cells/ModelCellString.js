import { useGlobalComponent } from 'rhino/hooks/overrides';
import CellString from 'rhino/components/table/cells/CellString';

export const ModelCellStringBase = (props) => <CellString {...props} />;

const ModelCellString = (props) =>
  useGlobalComponent('ModelCellString', ModelCellStringBase, props);

export default ModelCellString;
