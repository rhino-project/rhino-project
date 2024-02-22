import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import CellLinkTelephone from 'rhino/components/table/cells/CellLinkTelephone';

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
