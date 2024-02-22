import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import CellLinkEmail from '../../table/cells/CellLinkEmail';

export const ModelCellLinkEmailBase = (props) => <CellLinkEmail {...props} />;

const ModelCellLinkEmail = (props) =>
  useGlobalComponentForAttribute(
    'ModelCellLinkEmail',
    ModelCellLinkEmailBase,
    props
  );

export default ModelCellLinkEmail;
