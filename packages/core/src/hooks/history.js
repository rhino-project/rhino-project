import qs from 'qs';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBaseOwnerId } from './owner';

export const useParsedSearch = () => {
  const { search } = useLocation();

  return qs.parse(search, { ignoreQueryPrefix: true });
};

export const useBackHistoryLink = () => {
  const { search } = useLocation();

  const queryParams = useMemo(
    () => qs.parse(search, { ignoreQueryPrefix: true }),
    [search]
  );

  return queryParams.back;
};

export const useBackHistory = () => {
  const navigate = useNavigate();
  const backLink = useBackHistoryLink();

  // FIXME Should this be a push or a replace?
  return () => {
    if (backLink) {
      navigate(backLink);
    }
  };
};

export const useBaseOwnerPath = () => {
  const currentBaseOwnerId = useBaseOwnerId();

  return {
    build: (path, baseOwnerId = currentBaseOwnerId) => {
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
    push: (path, baseOwnerId = currentBaseOwnerId) => {
      navigate(baseOwnerPath.build(path, baseOwnerId));
    }
  };
};
