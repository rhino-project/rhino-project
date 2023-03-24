import CellTime from 'rhino/components/table/cells/CellTime';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

const defaultComponents = {
  ModelCellTime: CellTime
};

const ModelCellTime = ({ overrides, ...props }) => {
  const { ModelCellTime } = useGlobalOverrides(defaultComponents, overrides);

  return <ModelCellTime {...props}></ModelCellTime>;
};

export default ModelCellTime;
