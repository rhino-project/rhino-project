import CellCountry from 'rhino/components/table/cells/CellCountry';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

const defaultComponents = {
  ModelCellCountry: CellCountry
};

const ModelCellCountry = ({ overrides, ...props }) => {
  const { ModelCellCountry } = useGlobalOverrides(defaultComponents, overrides);

  return <ModelCellCountry {...props}></ModelCellCountry>;
};

export default ModelCellCountry;
