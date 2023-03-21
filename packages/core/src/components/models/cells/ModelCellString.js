import { useGlobalOverrides } from 'rhino/hooks/overrides';
import CellString from 'rhino/components/table/cells/CellString';

export const ModelCellStringBase = (props) => <CellString {...props} />;

const defaultComponents = { ModelCellString: ModelCellStringBase };

const ModelCellString = ({ overrides, ...props }) => {
  const { ModelCellString } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelCellString {...props} />;
};

export default ModelCellString;
