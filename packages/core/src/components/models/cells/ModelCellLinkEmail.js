import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import { CellLinkEmail } from '../../table/cells/CellLinkEmail';

export const ModelCellLinkEmailBase = (props) => <CellLinkEmail {...props} />;

export const ModelCellLinkEmail = (props) =>
  useGlobalComponentForAttribute(
    'ModelCellLinkEmail',
    ModelCellLinkEmailBase,
    props
  );
