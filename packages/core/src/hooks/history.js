import { DEFAULT_SORT, MAX_PAGES, PAGE_SIZE } from 'config';
import qs from 'qs';
import { useCallback, useMemo, useReducer, useRef, useState } from 'react';
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
export const useSearchParams = (baseFilters) => {
  const history = useHistory();
  const location = useLocation();
  const initialBaseFilters = useRef(baseFilters);
  const initialState = useMemo(() => {
    // When computing the initial state of filters, the URL has precedence over the baseFilters for everything except filters.
    // That means that if baseFilter has { order: 'a' } and the URL has ?order=b, the initial state of searchParams will have
    // { order: 'b' }, as it is the order value in the URL.

    // The filters key in the baseFilters object, however, represent implicit, fixed filters, meaning they have precedence
    // over anything else. They cannot be changed by setting URL, nor by the UI, nor they render pills of their own.
    // The initial value of searchParams will be a merge of filters from the URL and the baseFiltes, the latter being able to
    // override anything in the URL.

    const queryFromUrl = qs.parse(location.search, { ignoreQueryPrefix: true });
    return {
      search: queryFromUrl.search ?? baseFilters?.search ?? '',
      order: queryFromUrl.order ?? baseFilters?.order ?? DEFAULT_SORT,
      limit: (parseInt(queryFromUrl.limit) || baseFilters?.limit) ?? PAGE_SIZE,
      offset: (parseInt(queryFromUrl.offset) || baseFilters?.offset) ?? 0,
      filter: { ...(queryFromUrl.filter ?? {}), ...(baseFilters?.filter ?? {}) }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [state, setState] = useState(initialState);

  const setSearchParams = useCallback(
    ({ ...newSearchParams }) => {
      const finalParams = { ...state, ...newSearchParams };
      // if any filter changes, we need to go back to the first page, as the current
      // page might not even exist and harm the UX
      if (newSearchParams.hasOwnProperty('filter')) {
        finalParams.offset = 0;
      }
      setState(finalParams);
      history.push(withParams(location.pathname, finalParams));
    },
    [history, location?.pathname, state]
  );

  const resetFilters = useCallback(() => {
    setSearchParams({
      filter: initialBaseFilters.current?.filter ?? {},
      offset: 0
    });
  }, [setSearchParams]);

  return [state, setSearchParams, resetFilters];
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

export const usePaginationParams = (total, searchParams, setSearchParams) => {
  const limit = searchParams.limit;
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.round(searchParams.offset / limit + 0.5);

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

  const onSetPage = (page) => setSearchParams({ offset: (page - 1) * limit });

  return [
    searchParams.offset > 0,
    searchParams.offset + limit < totalPages * limit,
    firstPage,
    lastPage,
    totalPages,
    onSetPage,
    currentPage
  ];
};
