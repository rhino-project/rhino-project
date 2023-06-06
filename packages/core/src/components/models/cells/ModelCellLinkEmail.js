import { useGlobalComponent } from 'rhino/hooks/overrides';
import CellLinkEmail from 'rhino/components/table/cells/CellLinkEmail';

export const ModelCellLinkEmailBase = (props) => <CellLinkEmail {...props} />;

const ModelCellLinkEmail = (props) =>
  useGlobalComponent('ModelCellLinkEmail', ModelCellLinkEmailBase, props);

export default ModelCellLinkEmail;
