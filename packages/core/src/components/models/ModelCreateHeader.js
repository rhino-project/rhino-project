import { isBaseOwned } from 'rhino/utils/models';
import { breadcrumbFor } from 'rhino/utils/ui';
import ModelWrapper from 'rhino/components/models/ModelWrapper';
import { useModelCreateContext } from 'rhino/hooks/controllers';

export const ModelCreateHeader = (props) => {
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

ModelCreateHeader.propTypes = {};

export default ModelCreateHeader;
