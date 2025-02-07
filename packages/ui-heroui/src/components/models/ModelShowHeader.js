import { breadcrumbFor } from '../../utils/ui';
import { useModelShowContext } from '@rhino-project/core/hooks';
import { useGlobalComponentForModel } from '@rhino-project/core/hooks';

export const ModelShowHeaderBase = () => {
  const { model, resource } = useModelShowContext();

  return breadcrumbFor(model, resource, true);
};

ModelShowHeaderBase.propTypes = {};

export const ModelShowHeader = (props) =>
  useGlobalComponentForModel('ModelShowHeader', ModelShowHeaderBase, props);
