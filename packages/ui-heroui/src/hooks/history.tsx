import { useNavigate, useSearch } from '@tanstack/react-router';
import { useBaseOwnerId } from '@rhino-project/core/hooks';

export const useBackHistory = () => {
  const navigate = useNavigate();
  const backLink = useSearch({ strict: false });

  // FIXME Should this be a push or a replace?
  return () => {
    if (backLink) {
      navigate({ to: backLink });
    }
  };
};

export const useBaseOwnerPath = () => {
  const currentBaseOwnerId = useBaseOwnerId();

  return {
    build: (path: string, baseOwnerId = currentBaseOwnerId) => {
      if (baseOwnerId) {
        path = path.startsWith('/') ? path : `/${path}`;
        return `/${baseOwnerId}${path}`;
      }
      return '/';
    }
  };
};

export const useBaseOwnerNavigation = () => {
  const navigate = useNavigate();
  const baseOwnerPath = useBaseOwnerPath();
  const currentBaseOwnerId = useBaseOwnerId();

  return {
    push: (path: string, baseOwnerId = currentBaseOwnerId) => {
      navigate({ to: baseOwnerPath.build(path, baseOwnerId) });
    }
  };
};
