import { useGlobalComponentForAttribute } from '@rhino-project/core/hooks';
import { CellCountry } from '../../table/cells/CellCountry';

export const ModelCellCountryBase = (props) => <CellCountry {...props} />;

export const ModelCellCountry = (props) =>
  useGlobalComponentForAttribute(
    'ModelCellCountry',
    ModelCellCountryBase,
    props
  );
