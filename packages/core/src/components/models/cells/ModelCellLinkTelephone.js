import { useGlobalOverrides } from 'rhino/hooks/overrides';
import CellLinkTelephone from 'rhino/components/table/cells/CellLinkTelephone';

export const ModelCellLinkTelephoneBase = (props) => (
  <CellLinkTelephone {...props} />
);

const defaultComponents = {
  ModelCellLinkTelephone: ModelCellLinkTelephoneBase
};

const ModelCellLinkTelephone = ({ overrides, ...props }) => {
  const { ModelCellLinkTelephone } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelCellLinkTelephone {...props} />;
};

export default ModelCellLinkTelephone;
