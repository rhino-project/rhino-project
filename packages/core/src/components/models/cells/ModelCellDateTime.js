import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import { CellDateTime } from '../../table/cells/CellDateTime';

export const ModelCellDateTimeBase = (props) => <CellDateTime {...props} />;

export const ModelCellDateTime = (props) =>
  useGlobalComponentForAttribute(
    'ModelCellDateTime',
    ModelCellDateTimeBase,
    props
  );
