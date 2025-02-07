import { breadcrumbFor } from '../../utils/ui';
import { useModelEditContext } from '@rhino-project/core/hooks';
import { useGlobalComponentForModel } from '@rhino-project/core/hooks';

export const ModelEditHeaderBase = () => {
  const {
    model,
    show: { resource }
  } = useModelEditContext();

  return breadcrumbFor(model, resource, true);
};

ModelEditHeaderBase.propTypes = {};

export const ModelEditHeader = (props) =>
  useGlobalComponentForModel('ModelEditHeader', ModelEditHeaderBase, props);
