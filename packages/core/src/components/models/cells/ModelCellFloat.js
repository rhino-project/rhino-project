import { useGlobalOverrides } from 'rhino/hooks/overrides';
import CellFloat from 'rhino/components/table/cells/CellFloat';

export const ModelCellFloatBase = (props) => <CellFloat {...props} />;

const defaultComponents = { ModelCellFloat: ModelCellFloatBase };

const ModelCellFloat = ({ overrides, ...props }) => {
  const { ModelCellFloat } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelCellFloat {...props} />;
};

export default ModelCellFloat;
