import { useGlobalComponent } from 'rhino/hooks/overrides';
import CellDateTime from 'rhino/components/table/cells/CellDateTime';

export const ModelCellDateTimeBase = (props) => <CellDateTime {...props} />;

const ModelCellDateTime = (props) =>
  useGlobalComponent('ModelCellDateTime', ModelCellDateTimeBase, props);

export default ModelCellDateTime;
