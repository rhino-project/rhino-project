import { breadcrumbFor } from 'rhino/utils/ui';
import { useModelShowContext } from 'rhino/hooks/controllers';
import { useGlobalComponentForModel } from 'rhino/hooks/overrides';

export const ModelShowHeaderBase = () => {
  const { model, resource } = useModelShowContext();

  return breadcrumbFor(model, resource, true);
};

ModelShowHeaderBase.propTypes = {};

const ModelShowHeader = (props) =>
  useGlobalComponentForModel('ModelShowHeader', ModelShowHeaderBase, props);

export default ModelShowHeader;
