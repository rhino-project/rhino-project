import CellDate from 'rhino/components/table/cells/CellDate';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

const defaultComponents = {
  ModelCellDate: CellDate
};

const ModelCellDate = ({ overrides, ...props }) => {
  const { ModelCellDate } = useGlobalOverrides(defaultComponents, overrides);

  return <ModelCellDate {...props}></ModelCellDate>;
};

export default ModelCellDate;
