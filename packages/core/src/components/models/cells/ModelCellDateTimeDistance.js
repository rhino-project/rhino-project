import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import { CellDateTimeDistance } from '../../table/cells/CellDateTimeDistance';

export const ModelCellDateTimeDistanceBase = (props) => (
  <CellDateTimeDistance {...props} />
);

export const ModelCellDateTimeDistance = (props) =>
  useGlobalComponentForAttribute(
    'ModelCellDateTimeDistance',
    ModelCellDateTimeDistanceBase,
    props
  );
