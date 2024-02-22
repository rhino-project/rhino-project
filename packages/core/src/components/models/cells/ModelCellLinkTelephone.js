import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import CellLinkTelephone from '../../table/cells/CellLinkTelephone';

export const ModelCellLinkTelephoneBase = (props) => (
  <CellLinkTelephone {...props} />
);

const ModelCellLinkTelephone = (props) =>
  useGlobalComponentForAttribute(
    'ModelCellLinkTelephone',
    ModelCellLinkTelephoneBase,
    props
  );

export default ModelCellLinkTelephone;
