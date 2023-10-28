import { isBaseOwned } from 'rhino/utils/models';
import { breadcrumbFor } from 'rhino/utils/ui';
import { useModelCreateContext } from 'rhino/hooks/controllers';
import { useGlobalComponentForModel } from 'rhino/hooks/overrides';
import ModelSection from './ModelSection';

export const ModelCreateHeaderBase = () => {
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
    <ModelSection baseClassName="create-header">{breadcrumbs()}</ModelSection>
  );
};

ModelCreateHeaderBase.propTypes = {};

const ModelCreateHeader = (props) =>
  useGlobalComponentForModel('ModelCreateHeader', ModelCreateHeaderBase, props);

export default ModelCreateHeader;
