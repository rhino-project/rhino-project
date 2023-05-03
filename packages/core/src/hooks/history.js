import qs from 'qs';
import { useHistory, useLocation } from 'react-router-dom';
import { useBaseOwnerId } from './owner';
import { useMemo } from 'react';

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
  const history = useHistory();
  const backLink = useBackHistoryLink();

  // FIXME Should this be a push or a replace?
  return () => {
    if (backLink) {
      history.push(backLink);
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
  const history = useHistory();
  const baseOwnerPath = useBaseOwnerPath();
  const currentBaseOwnerId = useBaseOwnerId();

  return {
    push: (path, baseOwnerId = currentBaseOwnerId) => {
      history.push(baseOwnerPath.build(path, baseOwnerId));
    }
  };
};
