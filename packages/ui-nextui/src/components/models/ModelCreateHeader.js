import { isBaseOwned } from '@rhino-project/core/utils';
import { breadcrumbFor } from '../../utils/ui';
import { useModelCreateContext } from '@rhino-project/core/hooks';
import { useGlobalComponentForModel } from '@rhino-project/core/hooks';

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

  return breadcrumbs();
};

ModelCreateHeaderBase.propTypes = {};

export const ModelCreateHeader = (props) =>
  useGlobalComponentForModel('ModelCreateHeader', ModelCreateHeaderBase, props);
