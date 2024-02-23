import { breadcrumbFor } from '../../utils/ui';
import { useModelEditContext } from '../../hooks/controllers';
import { useGlobalComponentForModel } from '../../hooks/overrides';
import ModelSection from './ModelSection';

export const ModelEditHeaderBase = () => {
  const {
    model,
    show: { resource }
  } = useModelEditContext();

  return (
    <ModelSection baseClassName="edit-header">
      {breadcrumbFor(model, resource, true)}
    </ModelSection>
  );
};

ModelEditHeaderBase.propTypes = {};

const ModelEditHeader = (props) =>
  useGlobalComponentForModel('ModelEditHeader', ModelEditHeaderBase, props);

export default ModelEditHeader;
