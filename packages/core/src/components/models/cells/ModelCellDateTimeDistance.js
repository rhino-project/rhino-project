import { useGlobalComponent } from 'rhino/hooks/overrides';
import CellDateTimeDistance from 'rhino/components/table/cells/CellDateTimeDistance';

export const ModelCellDateTimeDistanceBase = (props) => (
  <CellDateTimeDistance {...props} />
);

const ModelCellDateTimeDistance = (props) =>
  useGlobalComponent(
    'ModelCellDateTimeDistance',
    ModelCellDateTimeDistanceBase,
    props
  );

export default ModelCellDateTimeDistance;
