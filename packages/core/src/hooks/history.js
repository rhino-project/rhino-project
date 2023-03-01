import qs from 'qs';
import { useHistory, useLocation } from 'react-router-dom';
import routePaths from 'rhino/routes';
import { useBaseOwnerId } from './owner';

export const useParsedSearch = () => {
  const { search } = useLocation();

  return qs.parse(search, { ignoreQueryPrefix: true });
};

export const useBackHistory = () => {
  const baseOwnerNavigation = useBaseOwnerNavigation();
  const { search } = useLocation();
  const history = useHistory();

  const queryParams = qs.parse(search, { ignoreQueryPrefix: true });

  // FIXME Should this be a push or a replace?
  return () => {
    if (queryParams.back) {
      history.push(queryParams.back);
    } else {
      baseOwnerNavigation.push(routePaths.rootpath());
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
