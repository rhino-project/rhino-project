import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import {
  filter,
  isEqual,
  isPlainObject,
  isString,
  merge,
  omit
} from 'lodash-es';
import { FieldErrors, useForm } from 'react-hook-form';
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
import {
  getBaseOwnerFilters,
  getParentModel,
  getReferenceAttributes,
  isIdentifier
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
import {
  Resources,
  RhinoResource,
  RhinoResourceName,
  RhinoResourceSpecifier,
  RhinoResourceSpecifierToResource
} from '..';
import { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { AxiosRequestConfig } from 'axios';
import { NetworkParamError } from '../lib';

export const DEFAULT_LIMIT = 10;

const useFormBuildErrors = (): [
  FieldErrors | undefined,
  UseMutationOptions<unknown, Error, unknown>['onError']
] => {
  const [errors, setErrors] = useState<FieldErrors | undefined>(undefined);

  const onError = useCallback((e: Error) => {
    if (!(e instanceof NetworkParamError)) {
      return;
    }

    // Errors can be an array of strings or an object with keys
    // If it is an array of strings, we assume it is a base error
    if (Array.isArray(e.errors)) {
      setErrors({
        // @ts-expect-error FIXME: need better typing
        root: {
          message: e.errors?.[0]
        }
      });
      return;
    }

    const newErrors = Object.keys(e.errors).reduce((errorObj, name) => {
      const key = name === 'base' ? 'root' : name;

      errorObj[key] = {
        type: 'manual',
        // @ts-expect-error FIXME: need better typing
        message: e.errors[name][0]
      };

      return errorObj;
    }, {} as FieldErrors);

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
const findDeepDifference = (
  obj1: Record<string, unknown>,
  obj2: Record<string, unknown>
) => {
  const differences = {} as Record<string, unknown>;

  const compare = (
    item1: Record<string, unknown>,
    item2: Record<string, unknown>,
    path = []
  ) => {
    if (isPlainObject(item2)) {
      Object.keys(item2).forEach((key) => {
        if (
          !item1 ||
          !Object.prototype.hasOwnProperty.call(item1, key) ||
          isPlainObject(item2[key])
        ) {
          // @ts-expect-error FIXME: need better typing
          compare(item1 && item1[key], item2[key], path.concat(key));
        }
      });
    } else if (
      !item1 ||
      // @ts-expect-error FIXME: need better typing
      !Object.prototype.hasOwnProperty.call(item1, path[path.length - 1])
    ) {
      // Assign value only if the key does not exist in obj1
      let current = differences;
      for (let i = 0; i < path.length - 1; i++) {
        // @ts-expect-error FIXME: need better typing
        if (!current[path[i]]) current[path[i]] = {};
        // @ts-expect-error FIXME: need better typing
        current = current[path[i]];
      }
      // @ts-expect-error FIXME: need better typing
      current[path[path.length - 1]] = item2;
    }
  };

  compare(obj1, obj2);

  return differences;
};

// https://chat.openai.com/share/55cc13f5-99ae-43f4-9781-15c0016861e9
// Counts the number of leaf nodes in an object
const countLeafNodes = (obj: Record<string, unknown>) => {
  const reducer = (acc: number, value: unknown): number => {
    if (isPlainObject(value)) {
      return (
        acc + Object.values(value as Record<string, unknown>).reduce(reducer, 0)
      );
    } else {
      return acc + 1;
    }
  };

  return Object.values(obj).reduce(reducer, 0);
};

export type UseModelIndexControllerOptions<T extends RhinoResourceSpecifier> = {
  defaultFiltersBaseOwner?: boolean;
  defaultFilter?: object;
  defaultLimit?: number;
  defaultOffset?: number;
  defaultOrder?: string;
  defaultSearch?: string;
  defaultGeospatial?: object;
  initialState?: {
    search?: string;
    order?: string;
    limit?: number;
    offset?: number;
    filter?: Record<string, unknown>;
    geospatial?: Record<string, unknown>;
  };
  model: T;
  paths?: T extends RhinoResourceName
    ? (keyof Resources[T])[]
    : T['model'] extends RhinoResourceName
      ? (keyof Resources[T['model']])[]
      : never;
  queryOptions?: Partial<UseQueryOptions<RhinoResourceSpecifierToResource<T>>>;
  networkOptions?: Partial<AxiosRequestConfig>;
};

// Reset/change default state - when baseOwnerFilter changes for instance or tabbed filtering
//      Does initial state need to be reset?
// Count of filters
export const useModelIndexController = <T extends RhinoResourceSpecifier>(
  options: UseModelIndexControllerOptions<T>
) => {
  const model = useModel(options.model);
  const { defaultFiltersBaseOwner = true } = options;
  const baseOwnerId = useBaseOwnerId();

  const defaultState = useRef({
    filter: (defaultFiltersBaseOwner
      ? (merge(
          getBaseOwnerFilters(model, baseOwnerId),
          options?.defaultFilter
        ) ?? {})
      : (options?.defaultFilter ?? {})) as Record<string, unknown>,
    limit: options?.defaultLimit ?? DEFAULT_LIMIT,
    offset: options?.defaultOffset ?? 0,
    order: options?.defaultOrder ?? DEFAULT_SORT,
    search: options?.defaultSearch ?? '',
    geospatial: (options?.defaultGeospatial ?? {}) as Record<string, unknown>
  });

  const storedInitialState = useRef<{
    search?: string;
    order?: string;
    limit?: number;
    offset?: number;
    filter?: Record<string, unknown>;
    geospatial?: Record<string, unknown>;
  } | null>(null);

  // https://react.dev/reference/react/useRef#avoiding-recreating-the-ref-contents
  if (storedInitialState.current === null) {
    // When computing the initial state of filters, the URL has precedence over the baseFilters for everything except filters.
    // That means that if baseFilter has { order: 'a' } and the URL has ?order=b, the initial state of searchParams will have
    // { order: 'b' }, as it is the order value in the URL.

    // The filters key in the baseFilters object, however, represent implicit, fixed filters, meaning they have precedence
    // over anything else. They cannot be changed by setting URL, nor by the UI, nor they render pills of their own.
    // The initial value of searchParams will be a merge of filters from the URL and the baseFiltes, the latter being able to
    // override anything in the URL.

    const initialState = options.initialState ?? {};

    storedInitialState.current = {
      search: initialState.search ?? defaultState.current?.search,
      order: initialState.order ?? defaultState.current?.order,
      limit: initialState.limit || defaultState.current?.limit,
      offset: initialState.offset || defaultState.current?.offset,
      // Merge the filters from the URL with the filters from the baseFilters, the latter having precedence
      // This handles cases such as project.client.id in the filters and project.id in the baseFilters
      // If we did not merge, the project.client.id would be lost
      filter: merge(
        {},
        initialState.filter ?? {},
        defaultState.current?.filter
      ),
      geospatial: merge(
        {},
        initialState.geospatial ?? {},
        defaultState.current?.geospatial
      )
    };
  }

  const [filter, internalSetFilter] = useState(
    findDeepDifference(
      defaultState.current.filter,
      storedInitialState.current.filter!
    )
  );
  const [fullFilter, setFullFilter] = useState<Record<string, unknown>>(
    storedInitialState.current.filter!
  );
  const [geospatial, internalSetGeospatial] = useState(
    findDeepDifference(
      defaultState.current.geospatial,
      storedInitialState.current.geospatial!
    )
  );
  const [fullGeospatial, setFullGeospatial] = useState(
    storedInitialState.current.geospatial
  );
  const [limit, setLimit] = useState<number>(storedInitialState.current.limit!);
  const [offset, setOffset] = useState<number>(
    storedInitialState.current.offset!
  );
  const [order, setOrder] = useState<string>(storedInitialState.current.order!);
  const [search, setSearch] = useState<string>(
    storedInitialState.current.search!
  );

  const setFilter = useCallback((filter: Record<string, unknown>) => {
    internalSetFilter(findDeepDifference(defaultState.current.filter, filter));
    setFullFilter(merge({}, filter ?? {}, defaultState.current?.filter));
  }, []);

  const setDefaultFilter = useCallback(
    (defaultFilter: Record<string, unknown>) => {
      const updatedDefaultFilter = defaultFiltersBaseOwner
        ? merge({}, getBaseOwnerFilters(model, baseOwnerId), defaultFilter)
        : defaultFilter;

      defaultState.current.filter = updatedDefaultFilter ?? {};

      const newFilter = findDeepDifference(defaultState.current.filter, filter);
      const newFullFilter = merge({}, newFilter, defaultState.current?.filter);

      // @ts-expect-error this will definitely be an object by now
      initialState.current.filter = newFullFilter;

      internalSetFilter(newFilter);
      setFullFilter(newFullFilter);
    },
    [baseOwnerId, defaultFiltersBaseOwner, filter, model]
  );

  const setGeospatial = useCallback((geospatial: Record<string, unknown>) => {
    internalSetGeospatial(
      findDeepDifference(defaultState.current.geospatial, geospatial)
    );
    setFullGeospatial(
      merge({}, geospatial ?? {}, defaultState.current?.geospatial)
    );
  }, []);

  const setDefaultGeospatial = useCallback(
    (defaultGeospatial: Record<string, unknown>) => {
      defaultState.current.geospatial = defaultGeospatial ?? {};

      const newGeospatial = findDeepDifference(
        defaultState.current.geospatial,
        geospatial
      );
      const newFullGeospatial = merge(
        {},
        newGeospatial,
        defaultState.current?.geospatial
      );

      // @ts-expect-error this will definitely be an object by now
      initialState.current.geospatial = newFullGeospatial;

      internalSetGeospatial(newGeospatial);
      setFullGeospatial(newFullGeospatial);
    },
    [geospatial]
  );

  const query = useModelIndex(model, {
    filter: fullFilter,
    geospatial: fullGeospatial,
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
    // @ts-expect-error FIXME: fix me with bug in ModelPager
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
  const setPage = (page: number) => setOffset((page - 1) * limit);

  const isEqualToDefault = useMemo(
    () =>
      isEqual(
        {
          filter: fullFilter,
          geospatial: fullGeospatial,
          limit,
          offset,
          order,
          search
        },
        defaultState.current
      ),
    [fullFilter, fullGeospatial, limit, offset, order, search]
  );

  useEffect(
    // This will definitely be set by now
    () => setOffset(storedInitialState.current!.offset!),
    [filter, geospatial, search, limit]
  );

  return {
    defaultState: defaultState.current,
    initialState: storedInitialState.current,
    isEqualToDefault,
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
    geospatial,
    setGeospatial,
    fullGeospatial,
    setDefaultGeospatial,
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

const getViewablePaths = (model: RhinoResource) =>
  filter(model.properties, (a) => {
    return (
      !isIdentifier(a) &&
      a.name !== model.ownedBy &&
      !(a.type === 'array' && a.readOnly) &&
      a.writeOnly !== true
    );
  }).map((a) => a.name);

export type UseModelShowControllerOptions<T extends RhinoResourceSpecifier> = {
  extraDefaultValues?: object;
  model: T;
  modelId: string | number;
  paths?: T extends RhinoResourceName
    ? (keyof Resources[T])[]
    : T['model'] extends RhinoResourceName
      ? (keyof Resources[T['model']])[]
      : never;
  queryOptions?: Partial<UseQueryOptions<RhinoResourceSpecifierToResource<T>>>;
  networkOptions?: Partial<AxiosRequestConfig>;
};

export const useModelShowController = <T extends RhinoResourceSpecifier>(
  options: UseModelShowControllerOptions<T>
) => {
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
const getCreatablePaths = (model: RhinoResource) =>
  getCreatableAttributes(model)
    .filter((a) => a.name !== model.ownedBy)
    .filter((a) => !a.anyOf || a.anyOf?.length <= 1)
    .map((a) => a.name);

export type UseModelCreateControllerOptions<T extends RhinoResourceSpecifier> =
  {
    autoFocus?:
      | boolean
      | (T extends RhinoResourceName
          ? keyof Resources[T]['properties']
          : T['model'] extends RhinoResourceName
            ? keyof Resources[T['model']]['properties']
            : never);
    disabled?: boolean;
    extraDefaultValues?: object;
    model: T;
    parentId: string | number;
    paths?: T extends RhinoResourceName
      ? (keyof Resources[T])[]
      : T['model'] extends RhinoResourceName
        ? (keyof Resources[T['model']])[]
        : never;
    queryOptions?: UseQueryOptions;
    networkOptions?: AxiosRequestConfig;
  };

export const useModelCreateController = <T extends RhinoResourceSpecifier>(
  options: UseModelCreateControllerOptions<T>
) => {
  const model = useModel(options.model);
  const {
    extraDefaultValues,
    autoFocus = true,
    parentId,
    paths,
    queryOptions
  } = options;
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
    extraDefaultValues: { [model.ownedBy]: parentId, ...extraDefaultValues }
  });
  const resolver = useResolver(schema);

  const methods = useForm({
    defaultValues,
    disabled: options?.disabled ?? (showParent.isLoading || mutation.isPending),
    errors,
    resolver,
    ...options
  });
  const { setFocus } = methods;

  useEffect(() => {
    // If the focus is true, set the focus to the first path if it is a string
    if (autoFocus === true && isString(computedPaths?.[0])) {
      setFocus(computedPaths?.[0]);
      // If the focus is a string (not false), set the focus to that path
    } else if (isString(autoFocus)) {
      setFocus(autoFocus);
    }
  }, [computedPaths, autoFocus, setFocus]);

  return {
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
const getEditablePaths = (model: RhinoResource) =>
  getUpdatableAttributes(model)
    .filter((a) => a.name !== model.ownedBy)
    .map((a) => a.name);

export type UseModelEditControllerOptions<T extends RhinoResourceSpecifier> = {
  autoFocus?:
    | boolean
    | (T extends RhinoResourceName
        ? keyof Resources[T]['properties']
        : T['model'] extends RhinoResourceName
          ? keyof Resources[T['model']]['properties']
          : never);
  debounceDelay?: number;
  disabled?: boolean;
  extraDefaultValues?: object;
  model: T;
  modelId: string | number;
  paths?: T extends RhinoResourceName
    ? (keyof Resources[T])[]
    : T['model'] extends RhinoResourceName
      ? (keyof Resources[T['model']])[]
      : never;
  queryOptions?: UseQueryOptions;
  networkOptions?: AxiosRequestConfig;
};

export const useModelEditController = <T extends RhinoResourceSpecifier>(
  options: UseModelEditControllerOptions<T>
) => {
  const model = useModel(options.model);
  const {
    modelId,
    extraDefaultValues,
    autoFocus = true,
    paths,
    debounceDelay = 2000,
    queryOptions
  } = options;
  const [errors, onError] = useFormBuildErrors();

  const mutation = useModelUpdate(model, { onError });
  const debouncedMutate = useDebouncedCallback(
    // @ts-expect-error FIXME: better typing
    (data) => mutation.mutate(data),
    debounceDelay
  );

  // A modal for instance may not have a modelId yet
  const show = useModelShow(model, modelId, {
    // @ts-expect-error FIXME: why enabled error?
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
    disabled: options?.disabled ?? (show.isLoading || mutation.isPending),
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
    // If the focus is true, set the focus to the first path if it is a string
    if (autoFocus === true && isString(computedPaths?.[0])) {
      setFocus(computedPaths?.[0]);

      // If the focus is a string (not false), set the focus to that path
    } else if (isString(autoFocus)) {
      setFocus(autoFocus);
    }
  }, [computedPaths, autoFocus, setFocus]);

  return {
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

export const createFilteredObject = (obj: Record<string, unknown>) => {
  const result = {} as Record<string, unknown>;

  // iterate through all keys in the object
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // if the value is not undefined, add it to the new object
      if (obj[key] !== undefined) {
        // Check if the value is an array for "in" style filters
        if (Array.isArray(obj[key])) {
          // Directly copy the array
          result[key] = obj[key];
        }
        // if the value is an object (but not an array), recursively call the function
        else if (typeof obj[key] === 'object') {
          result[key] = createFilteredObject(
            obj[key] as Record<string, unknown>
          );
          // if the object is now empty, don't add it to the new object
          if (
            Object.keys(result[key] as Record<string, unknown>).length === 0
          ) {
            delete result[key];
          }
        } else {
          // If it's not an array or object, copy the value
          result[key] = obj[key];
        }
      }
    }
  }
  return result;
};

export type UseModelFiltersControllerOptions = {
  extraDefaultValues?: object;
  paths?: string[];
};

export const useModelFiltersController = (
  options: UseModelFiltersControllerOptions
) => {
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
    (path: string, value: string) => {
      setPills((pills) => ({ ...pills, [path]: value }));
    },
    [setPills]
  );

  const resetPill = useCallback(
    (path: string) => setPills((pills) => omit(pills, path)),
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
