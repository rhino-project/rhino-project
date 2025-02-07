import { useGlobalComponentForAttribute } from '@rhino-project/core/hooks';
import { CellString } from '../../table/cells/CellString';

export const ModelCellStringBase = (props) => <CellString {...props} />;

export const ModelCellString = (props) =>
  useGlobalComponentForAttribute('ModelCellString', ModelCellStringBase, props);
