import { CellBooleanIcon } from '../../table/cells/CellBooleanIcon';
import { useGlobalComponentForAttribute } from '@rhino-project/core/hooks';
export const ModelCellBooleanIconBase = (props) => (
  <CellBooleanIcon {...props} />
);

export const ModelCellBooleanIcon = (props) =>
  useGlobalComponentForAttribute(
    'ModelCellBooleanIcon',
    ModelCellBooleanIconBase,
    props
  );
