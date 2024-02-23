import CellBooleanIcon from '../../table/cells/CellBooleanIcon';
import { useGlobalComponentForAttribute } from '../../../hooks/overrides';

export const ModelCellBooleanIconBase = (props) => (
  <CellBooleanIcon {...props} />
);

const ModelCellBooleanIcon = (props) =>
  useGlobalComponentForAttribute(
    'ModelCellBooleanIcon',
    ModelCellBooleanIconBase,
    props
  );

export default ModelCellBooleanIcon;
