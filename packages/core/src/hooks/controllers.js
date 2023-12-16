import qs from 'qs';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { filter, isEqual, isString, merge } from 'lodash';
import { useForm } from 'react-hook-form';
import { ModelCreateContext } from 'rhino/components/models/ModelCreateProvider';
import { ModelEditContext } from 'rhino/components/models/ModelEditProvider';
import { ModelIndexContext } from 'rhino/components/models/ModelIndexProvider';
import { ModelShowContext } from 'rhino/components/models/ModelShowProvider';
import { useModel } from 'rhino/hooks/models';
import {
  useModelCreate,
  useModelDelete,
  useModelIndex,
  useModelShow,
  useModelUpdate
} from 'rhino/hooks/queries';
import withParams from 'rhino/routes/withParams';
import { getParentModel } from 'rhino/utils/models';
import { useDebouncedCallback } from 'use-debounce';
import {
  getCreatableAttributes,
  getUpdatableAttributes
} from '../utils/models';
import { useDefaultValues, useResolver, useSchema } from './form';
import { usePaths } from './paths';
import { useBaseOwnerFilters } from './owner';

export const DEFAULT_LIMIT = 10;

// FIXME: This should be calculated as the first sortable field found in the model
export const DEFAULT_SORT = '-updated_at';

// FIXME the calculation of first page number to show should be handled in the pager not in the controller
const MAX_PAGES = 3;

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
  const { syncUrl = true, defaultFiltersBaseOwner = true } = options;
  const baseOwnerFilter = useBaseOwnerFilters(model, {
    extraFilters: options?.filter
  });

  const navigate = useNavigate();
  const location = useLocation();

  const defaultState = useRef({
    filter: defaultFiltersBaseOwner
      ? baseOwnerFilter ?? {}
      : options?.filter ?? {},
    limit: options?.limit ?? DEFAULT_LIMIT,
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

  const query = useModelIndex(model, {
    filter,
    limit,
    offset,
    order,
    search,
    queryOptions: options?.queryOptions,
    networkOptions: options?.networkOptions
  });

  const create = useModelCreate(model);
  const update = useModelUpdate(model);
  const destroy = useModelDelete(model);

  // Pagination
  const totalPages = useMemo(
    () => Math.ceil(query.total / limit),
    [query.total, limit]
  );
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

  useEffect(() => {
    if (!syncUrl) return;

    if (
      isEqual({ filter, limit, offset, order, search }, defaultState.current)
    ) {
      // If the current state is the same as the default state, remove the query params from the URL but only if they are not already empty
      if (location.search) navigate(withParams(location.pathname, {}));
    } else {
      navigate(
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

  useEffect(
    () => setOffset(initialState.current.offset),
    [filter, search, limit]
  );

  return {
    model,
    parentId: options?.parentId,
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
    ...query,
    create,
    update,
    delete: destroy,
    destroy
  };
};

export const useModelShowContext = () => {
  const context = useContext(ModelShowContext);

  if (context === undefined) {
    throw new Error(
      'useModelShowContext must be used within a ModelShowProvider'
    );
  }
  return context;
};

const getViewablePaths = (model) =>
  filter(model.properties, (a) => {
    return (
      a.type !== 'identifier' &&
      a.name !== model.ownedBy &&
      !(a.type === 'array' && a.readOnly) &&
      a.writeOnly !== true
    );
  }).map((a) => a.name);

export const useModelShowController = (options) => {
  const model = useModel(options.model);
  const { extraDefaultValues, modelId, paths } = options;

  const query = useModelShow(model, modelId, {
    queryOptions: options?.queryOptions,
    networkOptions: options?.networkOptions
  });
  const { resource } = query;

  const create = useModelCreate(model);
  const update = useModelUpdate(model);
  const destroy = useModelDelete(model);

  const pathsOrDefault = useMemo(
    () => paths || getViewablePaths(model),
    [paths, model]
  );
  const computedPaths = usePaths(pathsOrDefault, resource);

  const schema = useSchema(model, computedPaths);
  const defaultValues = useDefaultValues(model, computedPaths, {
    extraDefaultValues
  });
  const resolver = useResolver(schema);

  const methods = useForm({
    defaultValues,
    resolver,
    values: resource,
    resetOptions: {
      // user-interacted input will be retained
      keepDirtyValues: true
    },
    ...options
  });

  return {
    model,
    modelId,
    methods,
    paths: computedPaths,
    resolver,
    schema,
    ...query,
    create,
    update,
    delete: destroy,
    destroy
  };
};

export const useModelCreateContext = () => {
  const context = useContext(ModelCreateContext);

  if (context === undefined) {
    throw new Error(
      'useModelCreateContext must be used within a ModelCreateProvider'
    );
  }
  return context;
};

// We removed ownedBy from the creatable attributes because it is set automatically
const getCreatablePaths = (model) =>
  getCreatableAttributes(model)
    .filter((a) => a.name !== model.ownedBy)
    .map((a) => a.name);

export const useModelCreateController = (options) => {
  const model = useModel(options.model);
  const { extraDefaultValues, parentId, paths, queryOptions } = options;

  const mutation = useModelCreate(model);

  // Fetch the parent model for the owner value and the breadcrumb
  const parentModel = useMemo(() => getParentModel(model), [model]);
  // A modal may not have a parent model yet
  const showParent = useModelShow(parentModel, parentId, {
    queryOptions: { enabled: !!parentId, ...queryOptions }
  });

  const pathsOrDefault = useMemo(
    () => paths || getCreatablePaths(model),
    [paths, model]
  );
  // FIXME: Do I need to pass the fake resource with the parent id?
  const computedPaths = usePaths(pathsOrDefault, {});

  const schema = useSchema(model, computedPaths);
  const defaultValues = useDefaultValues(model, computedPaths, {
    extraDefaultValues
  });
  const resolver = useResolver(schema);

  const methods = useForm({
    defaultValues,
    disabled:
      options?.disabled ?? (showParent.isInitialLoading || mutation.isLoading),
    resolver,
    ...options
  });
  const { setFocus } = methods;

  useEffect(() => {
    if (isString(computedPaths?.[0])) setFocus(computedPaths?.[0]);
  }, [computedPaths, setFocus]);

  return {
    model,
    parentId,
    parentModel,
    ...mutation,
    showParent,
    methods,
    paths: computedPaths,
    resolver,
    schema
  };
};

export const useModelEditContext = () => {
  const context = useContext(ModelEditContext);

  if (context === undefined) {
    throw new Error(
      'useModelEditContext must be used within a ModelEditProvider'
    );
  }
  return context;
};

// We removed ownedBy from the updatable attributes because it is set automatically
const getEditablePaths = (model) =>
  getUpdatableAttributes(model)
    .filter((a) => a.name !== model.ownedBy)
    .map((a) => a.name);

export const useModelEditController = (options) => {
  const model = useModel(options.model);
  const {
    modelId,
    extraDefaultValues,
    paths,
    debounceDelay = 2000,
    queryOptions
  } = options;

  const mutation = useModelUpdate(model);
  const debouncedMutate = useDebouncedCallback(
    (observation) => mutation.mutate(observation),
    debounceDelay
  );

  // A modal for instance may not have a modelId yet
  const show = useModelShow(model, modelId, {
    queryOptions: { enabled: !!modelId, ...queryOptions }
  });

  const { resource } = show;

  const pathsOrDefault = useMemo(
    () => paths || getEditablePaths(model),
    [paths, model]
  );
  const computedPaths = usePaths(pathsOrDefault, resource);

  const schema = useSchema(model, computedPaths);
  const defaultValues = useDefaultValues(model, computedPaths, {
    extraDefaultValues
  });
  const resolver = useResolver(schema);

  const methods = useForm({
    defaultValues,
    disabled:
      options?.disabled ?? (show.isInitialLoading || mutation.isLoading),
    resolver,
    values: resource,
    resetOptions: {
      // user-interacted input will be retained
      keepDirtyValues: true
    },
    ...options
  });
  const { setFocus } = methods;

  useEffect(() => {
    if (isString(computedPaths?.[0])) setFocus(computedPaths?.[0]);
  }, [computedPaths, setFocus]);

  return {
    model,
    modelId,
    ...mutation,
    debouncedMutate,
    show,
    methods,
    paths: computedPaths,
    resolver,
    schema
  };
};
