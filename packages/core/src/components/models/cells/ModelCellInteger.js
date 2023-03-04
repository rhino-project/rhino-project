import CellInteger from 'rhino/components/table/cells/CellInteger';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

const defaultComponents = {
  ModelCellInteger: CellInteger
};

const ModelCellInteger = ({ overrides, ...props }) => {
  const { ModelCellInteger } = useGlobalOverrides(defaultComponents, overrides);

  return <ModelCellInteger {...props}></ModelCellInteger>;
};

export default ModelCellInteger;
