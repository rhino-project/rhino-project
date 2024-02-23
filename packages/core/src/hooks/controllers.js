import qs from 'qs';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  filter,
  isEqual,
  isPlainObject,
  isString,
  merge,
  omit
} from 'lodash-es';
import { useForm } from 'react-hook-form';
import { ModelCreateContext } from '../components/models/ModelCreateProvider';
import { ModelEditContext } from '../components/models/ModelEditProvider';
import { ModelIndexContext } from '../components/models/ModelIndexProvider';
import { ModelShowContext } from '../components/models/ModelShowProvider';
import { useModel } from './models';
import {
  useModelCreate,
  useModelDelete,
  useModelIndex,
  useModelShow,
  useModelUpdate
} from './queries';
import { withParams } from '../routes/withParams';
import {
  getBaseOwnerFilters,
  getParentModel,
  getReferenceAttributes
} from '../utils/models';
import { useDebouncedCallback } from 'use-debounce';
import {
  getCreatableAttributes,
  getUpdatableAttributes
} from '../utils/models';
import { useDefaultValues, useResolver, useSchema } from './form';
import { usePaths } from './paths';
import { useBaseOwnerId } from './owner';
import { ModelFiltersContext } from '../components/models/ModelFiltersProvider';
import { yupFiltersFromAttribute } from '../utils/yup';

export const DEFAULT_LIMIT = 10;

const useFormBuildErrors = () => {
  const [errors, setErrors] = useState(null);

  const onError = useCallback((e) => {
    // Errors can be an array of strings or an object with keys
    // If it is an array of strings, we assume it is a base error
    if (Array.isArray(e.errors)) {
      setErrors({
        root: {
          type: 'manual',
          message: e.errors?.[0]
        }
      });
      return;
    }

    const newErrors = Object.keys(e.errors).reduce((errorObj, name) => {
      const key = name === 'base' ? 'root' : name;

      errorObj[key] = {
        type: 'manual',
        message: e.errors[name][0]
      };

      return errorObj;
    }, {});

    setErrors(newErrors);
  }, []);

  return [errors, onError];
};

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

// https://chat.openai.com/share/55cc13f5-99ae-43f4-9781-15c0016861e9
// Finds the keys unique to obj2
const findDeepDifference = (obj1, obj2) => {
  const differences = {};

  const compare = (item1, item2, path = []) => {
    if (isPlainObject(item2)) {
      Object.keys(item2).forEach((key) => {
        if (
          !item1 ||
          !Object.prototype.hasOwnProperty.call(item1, key) ||
          isPlainObject(item2[key])
        ) {
          compare(item1 && item1[key], item2[key], path.concat(key));
        }
      });
    } else if (
      !item1 ||
      !Object.prototype.hasOwnProperty.call(item1, path[path.length - 1])
    ) {
      // Assign value only if the key does not exist in obj1
      let current = differences;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }
      current[path[path.length - 1]] = item2;
    }
  };

  compare(obj1, obj2);
  return differences;
};

// https://chat.openai.com/share/55cc13f5-99ae-43f4-9781-15c0016861e9
// Counts the number of leaf nodes in an object
const countLeafNodes = (obj) => {
  const reducer = (acc, value) => {
    if (isPlainObject(value)) {
      return acc + Object.values(value).reduce(reducer, 0);
    } else {
      return acc + 1;
    }
  };

  return Object.values(obj).reduce(reducer, 0);
};

// Reset/change default state - when baseOwnerFilter changes for instance or tabbed filtering
//      Does initial state need to be reset?
// Count of filters
export const useModelIndexController = (options) => {
  const model = useModel(options.model);
  const { syncUrl = true, defaultFiltersBaseOwner = true } = options;
  const baseOwnerId = useBaseOwnerId();

  const navigate = useNavigate();
  const location = useLocation();
  const defaultState = useRef({
    filter: defaultFiltersBaseOwner
      ? merge(
          getBaseOwnerFilters(model, baseOwnerId),
          options?.defaultFilter
        ) ?? {}
      : options?.defaultFilter ?? {},
    limit: options?.defaultLimit ?? DEFAULT_LIMIT,
    offset: options?.defaultOffset ?? 0,
    order: options?.defaultOrder ?? DEFAULT_SORT,
    search: options?.defaultSearch ?? ''
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

  const [filter, internalSetFilter] = useState(
    findDeepDifference(defaultState.current.filter, initialState.current.filter)
  );
  const [fullFilter, setFullFilter] = useState(initialState.current.filter);
  const [limit, setLimit] = useState(initialState.current.limit);
  const [offset, setOffset] = useState(initialState.current.offset);
  const [order, setOrder] = useState(initialState.current.order);
  const [search, setSearch] = useState(initialState.current.search);

  const setFilter = useCallback((filter) => {
    internalSetFilter(findDeepDifference(defaultState.current.filter, filter));
    setFullFilter(merge({}, filter ?? {}, defaultState.current?.filter));
  }, []);

  const setDefaultFilter = useCallback(
    (defaultFilter) => {
      const updatedDefaultFilter = defaultFiltersBaseOwner
        ? merge({}, getBaseOwnerFilters(model, baseOwnerId), defaultFilter)
        : defaultFilter;

      defaultState.current.filter = updatedDefaultFilter ?? {};

      const newFilter = findDeepDifference(defaultState.current.filter, filter);
      const newFullFilter = merge({}, newFilter, defaultState.current?.filter);

      initialState.current.filter = newFullFilter;

      internalSetFilter(newFilter);
      setFullFilter(newFullFilter);
    },
    [baseOwnerId, defaultFiltersBaseOwner, filter, model]
  );

  const query = useModelIndex(model, {
    filter: fullFilter,
    limit,
    offset,
    order,
    search,
    queryOptions: options?.queryOptions,
    networkOptions: options?.networkOptions
  });

  const totalFilters = useMemo(() => countLeafNodes(filter), [filter]);
  const totalFullFilters = useMemo(
    () => countLeafNodes(fullFilter),
    [fullFilter]
  );

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
      isEqual(
        { filter: fullFilter, limit, offset, order, search },
        defaultState.current
      )
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
  }, [syncUrl, filter, fullFilter, search, limit, offset, order]);

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
    totalFilters,
    fullFilter,
    totalFullFilters,
    setDefaultFilter,
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

  const [errors, onError] = useFormBuildErrors();

  const query = useModelShow(model, modelId, {
    queryOptions: options?.queryOptions,
    networkOptions: options?.networkOptions
  });
  const { resource } = query;

  const create = useModelCreate(model, { onError });
  const update = useModelUpdate(model, { onError });
  const destroy = useModelDelete(model, { onError });

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
    errors,
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
// We removed anyOf with more than one element because we don't support them automatically
const getCreatablePaths = (model) =>
  getCreatableAttributes(model)
    .filter((a) => a.name !== model.ownedBy)
    .filter((a) => !a.anyOf || a.anyOf?.length <= 1)
    .map((a) => a.name);

export const useModelCreateController = (options) => {
  const model = useModel(options.model);
  const { extraDefaultValues, parentId, paths, queryOptions } = options;
  const [errors, onError] = useFormBuildErrors();

  const mutation = useModelCreate(model, { onError });

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
    errors,
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
  const [errors, onError] = useFormBuildErrors();

  const mutation = useModelUpdate(model, { onError });
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
    errors,
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

export const useModelFiltersContext = () => {
  const context = useContext(ModelFiltersContext);

  if (context === undefined) {
    throw new Error(
      'useModelFiltersContext must be used within a ModelFiltersProvider'
    );
  }
  return context;
};

const createFilteredObject = (obj) => {
  const result = {};
  // iterate through all keys in the object
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // if the value is not undefined, add it to the new object
      if (obj[key] !== undefined) {
        // if the value is an object, recursively call the function
        if (typeof obj[key] === 'object') {
          result[key] = createFilteredObject(obj[key]);
          // if the object is now empty, don't add it to the new object
          if (Object.keys(result[key]).length === 0) {
            delete result[key];
          }
        } else {
          result[key] = obj[key];
        }
      }
    }
  }
  return result;
};

export const useModelFiltersController = (options) => {
  const { setFilter, initialState, model } = useModelIndexContext();
  const { extraDefaultValues, paths } = options;
  const [pills, setPills] = useState({});

  const pathsOrDefault = useMemo(
    () =>
      paths ||
      getReferenceAttributes(model)
        .filter(
          (a) => a.name !== model.ownedBy && !a.name.endsWith('_attachment')
        )
        .filter((a) => !a.anyOf || a.anyOf?.length <= 1)
        .map((a) => a.name),
    [paths, model]
  );
  const computedPaths = usePaths(pathsOrDefault);

  const schema = useSchema(model, computedPaths, {
    yupSchemaFromAttribute: yupFiltersFromAttribute
  });
  const defaultValues = useDefaultValues(model, computedPaths, {
    extraDefaultValues,
    yupSchemaFromAttribute: yupFiltersFromAttribute
  });
  const resolver = useResolver(schema);

  const methods = useForm({
    defaultValues,
    values: initialState.filter,
    resolver,

    // Keep the default values because the initial state is likely to be sparse
    resetOptions: { keepDefaultValues: true }
  });
  const { watch } = methods;

  useEffect(() => {
    const subscription = watch((value) => {
      // Only pass the defined and non-null values to the filter
      setFilter(createFilteredObject(value));
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch]);

  const setPill = useCallback(
    (path, value) => {
      setPills((pills) => ({ ...pills, [path]: value }));
    },
    [setPills]
  );

  const resetPill = useCallback(
    (path) => setPills((pills) => omit(pills, path)),
    [setPills]
  );

  return {
    model,
    defaultValues,
    methods,
    paths: computedPaths,
    pills,
    setPill,
    resetPill,
    setPills
  };
};
