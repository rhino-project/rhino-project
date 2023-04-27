import { useGlobalOverrides } from 'rhino/hooks/overrides';
import CellLinkEmail from 'rhino/components/table/cells/CellLinkEmail';

export const ModelCellLinkEmailBase = (props) => <CellLinkEmail {...props} />;

const defaultComponents = {
  ModelCellLinkEmail: ModelCellLinkEmailBase
};

const ModelCellLinkEmail = ({ overrides, ...props }) => {
  const { ModelCellLinkEmail } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelCellLinkEmail {...props} />;
};

export default ModelCellLinkEmail;
