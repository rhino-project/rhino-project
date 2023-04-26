import CellBoolean from 'rhino/components/table/cells/CellBoolean';
import withGlobalOverrides from 'rhino/hooks/overrides';

export const ModelCellBooleanBase = (props) => <CellBoolean {...props} />;

const ModelCellBoolean = withGlobalOverrides(ModelCellBooleanBase);

export default ModelCellBoolean;
