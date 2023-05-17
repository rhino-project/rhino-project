import { breadcrumbFor } from 'rhino/utils/ui';
import { useModelShowContext } from 'rhino/hooks/controllers';

export const ModelShowHeader = () => {
  const { model, resource } = useModelShowContext();

  return breadcrumbFor(model, resource, true);
};

export default ModelShowHeader;
