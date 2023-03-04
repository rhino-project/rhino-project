import CellFloat from 'rhino/components/table/cells/CellFloat';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

const defaultComponents = {
  ModelCellFloat: CellFloat
};

const ModelCellFloat = ({ overrides, ...props }) => {
  const { ModelCellFloat } = useGlobalOverrides(defaultComponents, overrides);

  return <ModelCellFloat {...props}></ModelCellFloat>;
};

export default ModelCellFloat;
