import { useGlobalComponentForAttribute } from '@rhino-project/core/hooks';
import { CellCurrency } from '../../table/cells/CellCurrency';

export const ModelCellCurrencyBase = (props) => <CellCurrency {...props} />;

export const ModelCellCurrency = (props) =>
  useGlobalComponentForAttribute(
    'ModelCellCurrency',
    ModelCellCurrencyBase,
    props
  );
