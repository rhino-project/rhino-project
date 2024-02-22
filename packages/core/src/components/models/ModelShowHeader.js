import { breadcrumbFor } from '../../utils/ui';
import { useModelShowContext } from '../../hooks/controllers';
import { useGlobalComponentForModel } from '../../hooks/overrides';

export const ModelShowHeaderBase = () => {
  const { model, resource } = useModelShowContext();

  return breadcrumbFor(model, resource, true);
};

ModelShowHeaderBase.propTypes = {};

const ModelShowHeader = (props) =>
  useGlobalComponentForModel('ModelShowHeader', ModelShowHeaderBase, props);

export default ModelShowHeader;
