import { useGlobalOverrides } from 'rhino/hooks/overrides';
import CellDateTimeDistance from 'rhino/components/table/cells/CellDateTimeDistance';

export const ModelCellDateTimeDistanceBase = (props) => (
  <CellDateTimeDistance {...props} />
);

const defaultComponents = {
  ModelCellDateTimeDistance: ModelCellDateTimeDistanceBase
};

const ModelCellDateTimeDistance = ({ overrides, ...props }) => {
  const { ModelCellDateTimeDistance } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelCellDateTimeDistance {...props} />;
};

export default ModelCellDateTimeDistance;
