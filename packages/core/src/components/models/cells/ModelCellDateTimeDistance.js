import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import CellDateTimeDistance from 'rhino/components/table/cells/CellDateTimeDistance';

export const ModelCellDateTimeDistanceBase = (props) => (
  <CellDateTimeDistance {...props} />
);

const ModelCellDateTimeDistance = (props) =>
  useGlobalComponentForAttribute(
    'ModelCellDateTimeDistance',
    ModelCellDateTimeDistanceBase,
    props
  );

export default ModelCellDateTimeDistance;
