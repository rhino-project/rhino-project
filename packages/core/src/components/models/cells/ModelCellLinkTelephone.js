import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import { CellLinkTelephone } from '../../table/cells/CellLinkTelephone';

export const ModelCellLinkTelephoneBase = (props) => (
  <CellLinkTelephone {...props} />
);

export const ModelCellLinkTelephone = (props) =>
  useGlobalComponentForAttribute(
    'ModelCellLinkTelephone',
    ModelCellLinkTelephoneBase,
    props
  );
