import { DEFAULT_SORT, MAX_PAGES, PAGE_SIZE } from 'config';
import qs from 'qs';
import { useReducer, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import routePaths from 'rhino/routes';
import withParams from 'rhino/routes/withParams';
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

// This hook is for tracking index params in the URL
// It has special handling for 'pills' which describe complementary UI elements
// Those are stored in state but not in the URL, it is up to the corresponding
// filter component to restore the state
export const useSearchParams = ({
  search: searchDefault = '',
  filter: filterDefault = {},
  order: orderDefault = DEFAULT_SORT,
  offset: offsetDefault = 0,
  limit: limitDefault = PAGE_SIZE
} = {}) => {
  const history = useHistory();
  const location = useLocation();
  const urlHasBeenWrittenBefore = useRef(false);

  const {
    search = searchDefault,
    filter = urlHasBeenWrittenBefore.current ? {} : filterDefault,
    order = orderDefault,
    offset = offsetDefault,
    limit = limitDefault
  } = qs.parse(location.search, { ignoreQueryPrefix: true });

  const searchParams = {
    search,
    filter,
    order,
    offset: parseInt(offset),
    limit: parseInt(limit)
  };

  const setSearchParams = ({ ...newSearchParams }) => {
    urlHasBeenWrittenBefore.current = true;
    const finalParams = { ...searchParams, ...newSearchParams };
    history.push(withParams(location.pathname, finalParams));
  };

  return [{ ...searchParams }, setSearchParams];
};

const pillsReducer = (state, action) => {
  switch (action.type) {
    case 'add':
      return { ...state, ...action.newPills };
    case 'reset':
      return {};
    default:
      throw new Error('Unexpected pillsReducer action');
  }
};

const pillsAddAction = (newPills) => ({
  type: 'add',
  newPills
});

const pillsResetAction = () => ({
  type: 'reset'
});

export const usePills = () => {
  const [state, dispatch] = useReducer(pillsReducer, {});

  const add = (newPills) => {
    dispatch(pillsAddAction(newPills));
  };

  const reset = () => {
    dispatch(pillsResetAction());
  };

  return { state, add, reset };
};

export const usePaginationParams = (total, limitDefault = PAGE_SIZE) => {
  const [{ offset }, setSearchParams] = useSearchParams({
    limit: limitDefault
  });

  const totalPages = Math.ceil(total / limitDefault);
  const currentPage = Math.round(offset / limitDefault + 0.5);

  const firstPage = Math.max(
    1,
    Math.min(
      currentPage - Math.round(MAX_PAGES / 2 - 0.5),
      totalPages - MAX_PAGES + 1
    )
  );
  const lastPage = Math.min(
    firstPage + Math.round(MAX_PAGES / 2 + 0.5),
    totalPages
  );

  const onSetPage = (page) =>
    setSearchParams({ offset: (page - 1) * PAGE_SIZE });

  return [
    offset > 0,
    offset + limitDefault < totalPages * limitDefault,
    firstPage,
    lastPage,
    totalPages,
    onSetPage,
    currentPage
  ];
};
