import CellCurrency from 'rhino/components/table/cells/CellString';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

const defaultComponents = {
  ModelCellCurrency: CellCurrency
};

const ModelCellCurrency = ({ overrides, ...props }) => {
  const { ModelCellCurrency } = useGlobalOverrides(
    defaultComponents,
    overrides
  );

  return <ModelCellCurrency {...props}></ModelCellCurrency>;
};

export default ModelCellCurrency;
