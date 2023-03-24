import CellString from 'rhino/components/table/cells/CellString';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

const defaultComponents = {
  ModelCellString: CellString
};

const ModelCellString = ({ overrides, ...props }) => {
  const { ModelCellString } = useGlobalOverrides(defaultComponents, overrides);

  return <ModelCellString {...props}></ModelCellString>;
};

export default ModelCellString;
