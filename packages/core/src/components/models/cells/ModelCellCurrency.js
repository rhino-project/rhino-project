import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import CellCurrency from '../../table/cells/CellCurrency';

export const ModelCellCurrencyBase = (props) => <CellCurrency {...props} />;

const ModelCellCurrency = (props) =>
  useGlobalComponentForAttribute(
    'ModelCellCurrency',
    ModelCellCurrencyBase,
    props
  );

export default ModelCellCurrency;
