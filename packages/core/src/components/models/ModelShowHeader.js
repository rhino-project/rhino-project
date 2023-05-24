import { breadcrumbFor } from 'rhino/utils/ui';
import { useModelShowContext } from 'rhino/hooks/controllers';
import { useGlobalComponent } from 'rhino/hooks/overrides';

export const ModelShowHeaderBase = () => {
  const { model, resource } = useModelShowContext();

  return breadcrumbFor(model, resource, true);
};

ModelShowHeaderBase.propTypes = {};

const ModelShowHeader = (props) =>
  useGlobalComponent('ModelShowHeader', ModelShowHeaderBase, props);

export default ModelShowHeader;
