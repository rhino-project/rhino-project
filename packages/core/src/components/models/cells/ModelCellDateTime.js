import { useGlobalOverrides } from 'rhino/hooks/overrides';
import CellDateTime from 'rhino/components/table/cells/CellDateTime';

export const ModelCellDateTimeBase = (props) => <CellDateTime {...props} />;

const defaultComponents = { ModelCellDateTime: ModelCellDateTimeBase };

const ModelCellDateTime = ({ overrides, ...props }) => {
  const { ModelCellDateTime } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelCellDateTime {...props} />;
};

export default ModelCellDateTime;
