import CellDateTime from 'rhino/components/table/cells/CellDateTime';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

const defaultComponents = {
  ModelCellDateTime: CellDateTime
};

const ModelCellDateTime = ({ overrides, ...props }) => {
  const { ModelCellDateTime } = useGlobalOverrides(
    defaultComponents,
    overrides
  );

  return <ModelCellDateTime {...props}></ModelCellDateTime>;
};

export default ModelCellDateTime;
