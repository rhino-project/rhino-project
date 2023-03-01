import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'qs';

import { DEFAULT_SORT, MAX_PAGES, PAGE_SIZE } from 'config';

import withParams from 'rhino/routes/withParams';
import { useModelIndex } from 'rhino/hooks/queries';
import { useModel } from 'rhino/hooks/models';
import { isEqual, merge } from 'lodash';
import { ModelIndexContext } from 'rhino/components/models/ModelIndexProvider';

export const useModelIndexContext = () => {
  const context = useContext(ModelIndexContext);

  if (context === undefined) {
    throw new Error(
      'useModelIndexContext must be used within a ModelIndexProvider'
    );
  }
  return context;
};

export const useModelIndexController = (options) => {
  const model = useModel(options.model);
  const { syncUrl = true } = options;

  const history = useHistory();
  const location = useLocation();

  const defaultState = useRef({
    filter: options?.filter ?? {},
    limit: options?.limit ?? PAGE_SIZE,
    offset: options?.offset ?? 0,
    order: options?.order ?? DEFAULT_SORT,
    search: options?.search ?? ''
  });

  const initialState = useRef(null);

  // https://beta.reactjs.org/reference/react/useRef#avoiding-recreating-the-ref-contents
  if (initialState.current === null) {
    // When computing the initial state of filters, the URL has precedence over the baseFilters for everything except filters.
    // That means that if baseFilter has { order: 'a' } and the URL has ?order=b, the initial state of searchParams will have
    // { order: 'b' }, as it is the order value in the URL.

    // The filters key in the baseFilters object, however, represent implicit, fixed filters, meaning they have precedence
    // over anything else. They cannot be changed by setting URL, nor by the UI, nor they render pills of their own.
    // The initial value of searchParams will be a merge of filters from the URL and the baseFiltes, the latter being able to
    // override anything in the URL.
    const queryFromUrl = syncUrl
      ? qs.parse(location.search, {
          ignoreQueryPrefix: true
        })
      : {};

    initialState.current = {
      search: queryFromUrl.search ?? defaultState.current?.search,
      order: queryFromUrl.order ?? defaultState.current?.order,
      limit: parseInt(queryFromUrl.limit) || defaultState.current?.limit,
      offset: parseInt(queryFromUrl.offset) || defaultState.current?.offset,
      // Merge the filters from the URL with the filters from the baseFilters, the latter having precedence
      // This handles cases such as project.client.id in the filters and project.id in the baseFilters
      // If we did not merge, the project.client.id would be lost
      filter: merge({}, queryFromUrl.filter ?? {}, defaultState.current?.filter)
    };
  }

  const [filter, setFilter] = useState(initialState.current.filter);
  const [limit, setLimit] = useState(initialState.current.limit);
  const [offset, setOffset] = useState(initialState.current.offset);
  const [order, setOrder] = useState(initialState.current.order);
  const [search, setSearch] = useState(initialState.current.search);

  // const query = {};
  const query = useModelIndex(model, {
    filter,
    limit,
    offset,
    order,
    search,
    queryOptions: options?.queryOptions,
    networkOptions: options?.networkOptions
  });

  // Pagination
  const totalPages = useMemo(() => Math.ceil(query.total / limit), [
    query.total,
    limit
  ]);
  const page = useMemo(() => Math.round(offset / limit + 0.5), [offset, limit]);
  const firstPage = useMemo(
    () =>
      Math.max(
        1,
        Math.min(
          page - Math.round(MAX_PAGES / 2 - 0.5),
          totalPages - MAX_PAGES + 1
        )
      ),
    [page, totalPages]
  );
  const lastPage = useMemo(
    () => Math.min(firstPage + Math.round(MAX_PAGES / 2 + 0.5), totalPages),
    [firstPage, totalPages]
  );
  const hasPrevPage = offset > 0;
  const hasNextPage = offset + limit < totalPages * limit;
  const setPage = (page) => setOffset((page - 1) * limit);

  // FIXME: Why will this render twice when filters are changed? the other params are fine
  useEffect(() => {
    if (!syncUrl) return;

    if (
      isEqual({ filter, limit, offset, order, search }, defaultState.current)
    ) {
      history.push(withParams(location.pathname, {}));
    } else {
      history.push(
        withParams(location.pathname, {
          filter,
          limit,
          offset,
          order,
          search
        })
      );
    }

    // https://github.com/facebook/react/issues/22305#issuecomment-1113508762
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncUrl, filter, search, limit, offset, order]);

  useEffect(() => setOffset(initialState.current.offset), [
    filter,
    search,
    limit
  ]);

  return {
    model,
    defaultState: defaultState.current,
    initialState: initialState.current,
    order,
    setOrder,
    search,
    setSearch,
    filter,
    setFilter,
    limit,
    setLimit,
    offset,
    setOffset,
    totalPages,
    page,
    hasPrevPage,
    hasNextPage,
    firstPage,
    lastPage,
    setPage,
    ...query
  };
};
