import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import CellCurrency from 'rhino/components/table/cells/CellCurrency';

export const ModelCellCurrencyBase = (props) => <CellCurrency {...props} />;

const ModelCellCurrency = (props) =>
  useGlobalComponentForAttribute(
    'ModelCellCurrency',
    ModelCellCurrencyBase,
    props
  );

export default ModelCellCurrency;
