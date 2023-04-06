import { useGlobalOverrides } from 'rhino/hooks/overrides';
import CellBooleanIcon from 'rhino/components/table/cells/CellBooleanIcon';

export const ModelCellBooleanIconBase = (props) => (
  <CellBooleanIcon {...props} />
);

const defaultComponents = { ModelCellBooleanIcon: ModelCellBooleanIconBase };

const ModelCellBooleanIcon = ({ overrides, ...props }) => {
  const { ModelCellBooleanIcon } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelCellBooleanIcon {...props} />;
};

export default ModelCellBooleanIcon;
