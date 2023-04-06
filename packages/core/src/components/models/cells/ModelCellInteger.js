import { useGlobalOverrides } from 'rhino/hooks/overrides';
import CellInteger from 'rhino/components/table/cells/CellInteger';

export const ModelCellIntegerBase = (props) => <CellInteger {...props} />;

const defaultComponents = { ModelCellInteger: ModelCellIntegerBase };

const ModelCellInteger = ({ overrides, ...props }) => {
  const { ModelCellInteger } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelCellInteger {...props} />;
};

export default ModelCellInteger;
