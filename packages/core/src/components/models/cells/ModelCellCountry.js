import { useGlobalComponent } from 'rhino/hooks/overrides';
import CellCountry from 'rhino/components/table/cells/CellCountry';

export const ModelCellCountryBase = (props) => <CellCountry {...props} />;

const ModelCellCountry = (props) =>
  useGlobalComponent('ModelCellCountry', ModelCellCountryBase, props);

export default ModelCellCountry;
