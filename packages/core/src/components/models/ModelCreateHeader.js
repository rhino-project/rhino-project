import { isBaseOwned } from '../../utils/models';
import { breadcrumbFor } from '../../utils/ui';
import { useModelCreateContext } from '../../hooks/controllers';
import { useGlobalComponentForModel } from '../../hooks/overrides';
import { ModelSection } from './ModelSection';

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

export const ModelCreateHeader = (props) =>
  useGlobalComponentForModel('ModelCreateHeader', ModelCreateHeaderBase, props);
