import { isBaseOwned } from 'rhino/utils/models';
import { breadcrumbFor } from 'rhino/utils/ui';
import ModelWrapper from 'rhino/components/models/ModelWrapper';
import { useModelCreateContext } from 'rhino/hooks/controllers';
import { useGlobalComponent } from 'rhino/hooks/overrides';

export const ModelCreateHeaderBase = (props) => {
  const {
    model,
    showParent: { model: parentModel, resource: parent }
  } = useModelCreateContext();

  const breadcrumbs = () => {
    if (!parent) return [];

    if (isBaseOwned(model)) return breadcrumbFor(model, {}, false);

    return breadcrumbFor(parentModel, parent, true);
  };

  return (
    <ModelWrapper model={model} {...props} baseClassName="create-header">
      {breadcrumbs()}
    </ModelWrapper>
  );
};

ModelCreateHeaderBase.propTypes = {};

const ModelCreateHeader = (props) =>
  useGlobalComponent(ModelCreateHeaderBase, props);

export default ModelCreateHeader;
