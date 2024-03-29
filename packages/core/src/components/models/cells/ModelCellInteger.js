import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import { CellInteger } from '../../table/cells/CellInteger';

export const ModelCellIntegerBase = (props) => <CellInteger {...props} />;

export const ModelCellInteger = (props) =>
  useGlobalComponentForAttribute(
    'ModelCellInteger',
    ModelCellIntegerBase,
    props
  );
