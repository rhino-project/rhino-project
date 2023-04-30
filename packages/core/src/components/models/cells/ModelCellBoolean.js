import CellBoolean from 'rhino/components/table/cells/CellBoolean';
import { useGlobalComponent } from 'rhino/hooks/overrides';

export const ModelCellBooleanBase = (props) => <CellBoolean {...props} />;

const ModelCellBoolean = (props) =>
  useGlobalComponent(ModelCellBooleanBase, props);

export default ModelCellBoolean;
