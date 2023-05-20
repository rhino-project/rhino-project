import { breadcrumbFor } from 'rhino/utils/ui';
import ModelWrapper from 'rhino/components/models/ModelWrapper';
import { useModelEditContext } from 'rhino/hooks/controllers';
import { useGlobalComponent } from 'rhino/hooks/overrides';

export const ModelEditHeaderBase = (props) => {
  const {
    model,
    show: { resource }
  } = useModelEditContext();

  return (
    <ModelWrapper model={model} {...props} baseClassName="edit-header">
      {breadcrumbFor(model, resource, true)}
    </ModelWrapper>
  );
};

ModelEditHeaderBase.propTypes = {};

const ModelEditHeader = (props) =>
  useGlobalComponent(ModelEditHeaderBase, props);

export default ModelEditHeader;
