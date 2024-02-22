import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import CellDateTime from '../../table/cells/CellDateTime';

export const ModelCellDateTimeBase = (props) => <CellDateTime {...props} />;

const ModelCellDateTime = (props) =>
  useGlobalComponentForAttribute(
    'ModelCellDateTime',
    ModelCellDateTimeBase,
    props
  );

export default ModelCellDateTime;
