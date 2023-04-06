import { useGlobalOverrides } from 'rhino/hooks/overrides';
import CellTime from 'rhino/components/table/cells/CellTime';

export const ModelCellTimeBase = (props) => <CellTime {...props} />;

const defaultComponents = { ModelCellTime: ModelCellTimeBase };

const ModelCellTime = ({ overrides, ...props }) => {
  const { ModelCellTime } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelCellTime {...props} />;
};

export default ModelCellTime;
