import { useGlobalOverrides } from 'rhino/hooks/overrides';
import CellCurrency from 'rhino/components/table/cells/CellCurrency';

export const ModelCellCurrencyBase = (props) => <CellCurrency {...props} />;

const defaultComponents = { ModelCellCurrency: ModelCellCurrencyBase };

const ModelCellCurrency = ({ overrides, ...props }) => {
  const { ModelCellCurrency } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelCellCurrency {...props} />;
};

export default ModelCellCurrency;
