import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import CellLinkEmail from 'rhino/components/table/cells/CellLinkEmail';

export const ModelCellLinkEmailBase = (props) => <CellLinkEmail {...props} />;

const ModelCellLinkEmail = (props) =>
  useGlobalComponentForAttribute(
    'ModelCellLinkEmail',
    ModelCellLinkEmailBase,
    props
  );

export default ModelCellLinkEmail;
