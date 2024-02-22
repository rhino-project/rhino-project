import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import CellDateTime from 'rhino/components/table/cells/CellDateTime';

export const ModelCellDateTimeBase = (props) => <CellDateTime {...props} />;

const ModelCellDateTime = (props) =>
  useGlobalComponentForAttribute(
    'ModelCellDateTime',
    ModelCellDateTimeBase,
    props
  );

export default ModelCellDateTime;
