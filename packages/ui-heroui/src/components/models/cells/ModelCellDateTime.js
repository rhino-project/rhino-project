import { useGlobalComponentForAttribute } from '@rhino-project/core/hooks';
import { CellDateTime } from '../../table/cells/CellDateTime';

export const ModelCellDateTimeBase = (props) => <CellDateTime {...props} />;

export const ModelCellDateTime = (props) =>
  useGlobalComponentForAttribute(
    'ModelCellDateTime',
    ModelCellDateTimeBase,
    props
  );
