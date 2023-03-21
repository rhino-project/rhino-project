import { useGlobalOverrides } from 'rhino/hooks/overrides';
import CellCountry from 'rhino/components/table/cells/CellCountry';

export const ModelCellCountryBase = (props) => <CellCountry {...props} />;

const defaultComponents = { ModelCellCountry: ModelCellCountryBase };

const ModelCellCountry = ({ overrides, ...props }) => {
  const { ModelCellCountry } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelCellCountry {...props} />;
};

export default ModelCellCountry;
