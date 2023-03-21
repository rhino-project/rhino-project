import { useGlobalOverrides } from 'rhino/hooks/overrides';
import CellDate from 'rhino/components/table/cells/CellDate';

export const ModelCellDateBase = (props) => <CellDate {...props} />;

const defaultComponents = { ModelCellDate: ModelCellDateBase };

const ModelCellDate = ({ overrides, ...props }) => {
  const { ModelCellDate } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelCellDate {...props} />;
};

export default ModelCellDate;
