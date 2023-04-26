import CellBooleanIcon from 'rhino/components/table/cells/CellBooleanIcon';
import withGlobalOverrides from 'rhino/hooks/overrides';

export const ModelCellBooleanIconBase = (props) => (
  <CellBooleanIcon {...props} />
);

const ModelCellBooleanIcon = withGlobalOverrides(ModelCellBooleanIconBase);

export default ModelCellBooleanIcon;
