import { useGlobalOverrides } from 'rhino/hooks/overrides';
import CellBoolean from 'rhino/components/table/cells/CellBoolean';

export const ModelCellBooleanBase = (props) => <CellBoolean {...props} />;

const defaultComponents = { ModelCellBoolean: ModelCellBooleanBase };

const ModelCellBoolean = ({ overrides, ...props }) => {
  const { ModelCellBoolean } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelCellBoolean {...props} />;
};

export default ModelCellBoolean;
