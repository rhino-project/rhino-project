import CellBooleanIcon from 'rhino/components/table/cells/CellBooleanIcon';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';

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
