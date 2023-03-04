import CellBoolean from 'rhino/components/table/cells/CellBoolean';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

const defaultComponents = {
  ModelCellBoolean: CellBoolean
};

const ModelCellBoolean = ({ overrides, ...props }) => {
  const { ModelCellBoolean } = useGlobalOverrides(defaultComponents, overrides);

  return <ModelCellBoolean {...props}></ModelCellBoolean>;
};

export default ModelCellBoolean;
