import { useGlobalComponentForAttribute } from '@rhino-project/core/hooks';
import { CellDate } from '../../table/cells/CellDate';

export const ModelCellDateBase = (props) => <CellDate {...props} />;

export const ModelCellDate = (props) =>
  useGlobalComponentForAttribute('ModelCellDate', ModelCellDateBase, props);
