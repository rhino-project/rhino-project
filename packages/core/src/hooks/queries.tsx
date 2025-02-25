import {
  useQuery,
  useQueryClient,
  useMutation,
  UseQueryResult,
  UseMutationResult,
  QueryKey,
  UseMutationOptions,
  UseQueryOptions
} from '@tanstack/react-query';
import { cloneDeep, has, merge, set } from 'lodash-es';

import { networkApiCallOnlyData } from '../lib/networking';
import { useModel } from './models';
import { useCallback, useMemo } from 'react';
import {
  RhinoRecord,
  RhinoRecordIdentifier,
  RhinoResource,
  RhinoResourceSpecifier,
  RhinoResourceSpecifierToResource
} from '..';
import { AxiosRequestConfig } from 'axios';

export const modelKey = (model: RhinoResourceSpecifier, action: string) =>
  `models-${model.pluralName}-${action}`;

/**
 * Create extra memoized values to augment a model index query
 * */
export const useModelIndexExtraNames = <T extends RhinoResourceSpecifier>(
  query: UseQueryResult<{
    results: RhinoResourceSpecifierToResource<T>[];
    total: number;
  }>
) => {
  const resources = useMemo(() => query?.data ?? null, [query.data]);
  const results = useMemo(() => resources?.results ?? null, [resources]);
  const total = useMemo(() => resources?.total ?? null, [resources]);

  const extraNames = useMemo(
    () => ({
      resources,
      results,
      total
    }),
    [results, resources, total]
  );

  return extraNames;
};

/**
 * Create extra memoized values to augment a model show query or model mutation
 * */
export const useModelShowExtraNames = <T extends RhinoResourceSpecifier>(
  query:
    | UseQueryResult<RhinoResourceSpecifierToResource<T>>
    | UseMutationResult<
        RhinoResourceSpecifierToResource<T>,
        Error,
        RhinoResourceSpecifierToResource<T>,
        unknown
      >
    | UseMutationResult<
        RhinoResourceSpecifierToResource<T>,
        Error,
        RhinoResourceSpecifierToResource<T> | number | string,
        unknown
      >
) => {
  const resource = useMemo(() => query?.data ?? null, [query.data]);

  const extraNames = useMemo(
    () => ({
      resource
    }),
    [resource]
  );

  return extraNames;
};

export const useModelPathMemberBuild = (model: RhinoResourceSpecifier) => {
  const memoModel = useModel(model);

  const build = useCallback(
    (data: RhinoRecord) =>
      memoModel.singular ? memoModel.path : `${memoModel.path}/${data.id}`,
    [memoModel]
  );

  return build;
};

export const useModelPathMember = (
  model: RhinoResourceSpecifier,
  data: RhinoRecord
) => {
  const build = useModelPathMemberBuild(model);
  const path = useMemo(() => build(data), [build, data]);

  return path;
};

export const useModelPathCollection = (model: RhinoResourceSpecifier) => {
  const memoModel = useModel(model);
  const path = useMemo(() => memoModel.path, [memoModel]);

  return path;
};

/**
 * Creates a memoized query key for the given model and action

 * @example
 *    const model = useModelKey('blog', 'show')
 *    const model = useModelKey('blog', 'index')
 *    const model = useModelKey('blog', 'index', ['search=test'])
 */
export const useModelKey = (
  model: RhinoResourceSpecifier,
  action: 'index' | 'show',
  extraKeys = [] as unknown[]
): QueryKey => {
  const memoModel = useModel(model);

  const queryKey = useMemo(
    () => [modelKey(memoModel, action), ...extraKeys],
    [memoModel, action, extraKeys]
  );

  return queryKey;
};

/**
 * Creates a memoized query key for the index action of the given model
 *
 * @example
 *    const queryKey = useModelKeyIndex('blog')
 *    const queryKey = useModelKeyIndex('blog', ['search=test'])
 */
export const useModelKeyIndex = (
  model: RhinoResourceSpecifier,
  extraKeys = [] as unknown[]
) => {
  return useModelKey(model, 'index', extraKeys);
};

/**
 * Provides a memoized function to construct a query key for the show action of the given model id.
 * Useful when the 'id' of a model instance is not known until later, such as during a mutation.
 *
 * @example
 ```
 // Get the builder
 const { build } = useModelKeyShowBuild('blog');
 //...hack hack hack...
 // Later build the query key
 const queryKey = build(3);
 ```
 */
export const useModelKeyShowBuild = (
  model: RhinoResourceSpecifier,
  extraKeys = [] as unknown[]
) => {
  const modelKey = useModelKey(model, 'show');

  // Always ensure the id is a string for consistency
  // Singular model has no id key
  const build = useCallback(
    (id: RhinoRecordIdentifier): QueryKey =>
      [...modelKey, model.singular ? null : `${id}`, ...extraKeys].filter(
        Boolean
      ),
    [model, modelKey, extraKeys]
  );

  return { build };
};

/**
 * Creates a memoized query key for the show action of the given model
 *
 * @example
 *    const queryKey = useModelKeyShow('blog', '3')
 *    const queryKey = useModelKeyShow('blog', 3, ['search=test'])
 */
export const useModelKeyShow = (
  model: RhinoResourceSpecifier,
  id: number | string,
  extraKeys = [] as unknown[]
) => {
  const { build } = useModelKeyShowBuild(model, extraKeys);
  const modelKey = useMemo(() => build(id), [build, id]);

  return modelKey;
};

/**
 * Returns a callback to invalidate index queries for the given model.
 *
 * @example
 ```
 const { mutate } = useModelUpdate('blog')
 const { invalidate } = useModelInvalidateIndex('blog_post')

 // After updating the blog, invalidate related blog post queries
 mutate({ id: 3, published: false }, { onSuccess: invalidate })
 ```
 */
export const useModelInvalidateIndex = (
  model: RhinoResourceSpecifier,
  extraKeys = [] as unknown[]
) => {
  const queryClient = useQueryClient();
  const modelKey = useModelKeyIndex(model, extraKeys);

  const invalidate = useCallback(
    () => queryClient.invalidateQueries({ queryKey: modelKey }),
    [queryClient, modelKey]
  );

  return { invalidate, invalidateIndex: invalidate };
};

/**
 * Returns a callback to invalidate show queries for the given model instance
 * 
 * @example
 ```
 const { mutate } = useModelUpdate('blog')
 const { invalidate } = useModelInvalidateShow('blog_post')

 // After updating the blog, invalidate related show queries for a blog post
 mutate({ id: 3, published: false }, { onSuccess: () => invalidate(7) })
 ```
 */
export const useModelInvalidateShow = (
  model: RhinoResourceSpecifier,
  extraKeys = [] as unknown[]
) => {
  const queryClient = useQueryClient();
  const { build } = useModelKeyShowBuild(model, extraKeys);

  const invalidate = useCallback(
    (id: RhinoRecordIdentifier) =>
      queryClient.invalidateQueries({ queryKey: build(id) }),
    [queryClient, build]
  );

  return { invalidate, invalidateShow: invalidate };
};

/**
 * Returns a callback to invalidate index and show queries for the given model and model instance
 *
 * @example
 ```
 const { mutate } = useModelUpdate('blog')
 const { invalidate } = useModelInvalidate('blog_post')

 // After updating the blog, invalidate related index queries for all blog posts
 // and show queries for a particular blog post
 mutate({ id: 3, published: false }, { onSuccess: () => invalidate(7) })
 ```
 */
export const useModelInvalidate = (
  model: RhinoResourceSpecifier,
  { extraIndexKeys = [] as unknown[], extraShowKeys = [] as unknown[] } = {}
) => {
  const { invalidateIndex } = useModelInvalidateIndex(model, extraIndexKeys);
  const { invalidateShow } = useModelInvalidateShow(model, extraShowKeys);

  const invalidate = useCallback(
    async (id: RhinoRecordIdentifier) =>
      Promise.all([invalidateShow(id), invalidateIndex()]),
    [invalidateIndex, invalidateShow]
  );

  return { invalidate };
};

// The mutation actions return a promise so that callers can perform actions
// after successful resolution.
// https://react-query.tanstack.com/guides/mutations#promises
//
// The mutation actions also invalidate the obviously relevant queries

export type UseModelCreateResults<T> = UseMutationResult<
  RhinoResourceSpecifierToResource<T>,
  unknown,
  RhinoResourceSpecifierToResource<T>
> & {
  model: RhinoResource;
  resource: RhinoResourceSpecifierToResource<T> | null;
};

/**
 * Provides a mutation action to create an instance of the given model.
 * Invalidates all index queries related to the given model.
 *
 * @example
 *    const { isPending, mutate} = useModelCreate('blog')
 *    const { isPending, mutate} = useModelCreate('blog', { onSuccess: () => console.log('do something')})
 *    const { resource, model, mutate} = useModelCreate('blog')
 */
export const useModelCreate = <T extends RhinoResourceSpecifier>(
  model: T,
  mutationOptions: Partial<
    UseMutationOptions<
      RhinoResourceSpecifierToResource<T>,
      Error,
      RhinoResourceSpecifierToResource<T>
    >
  > = {}
): UseModelCreateResults<T> => {
  const memoModel = useModel(model);
  const { invalidate } = useModelInvalidateIndex(model);
  const endpoint = useModelPathCollection(model);

  const mutation = useMutation<
    RhinoResourceSpecifierToResource<T>,
    Error,
    RhinoResourceSpecifierToResource<T>
  >({
    mutationFn: (data) =>
      networkApiCallOnlyData(endpoint, { method: 'post', data }) as Promise<
        RhinoResourceSpecifierToResource<T>
      >,
    onSuccess: invalidate,
    ...mutationOptions
  });

  const extraNames = useModelShowExtraNames(mutation);

  return { ...mutation, model: memoModel, ...extraNames };
};

export type UseModelUpdateResults<T> = UseMutationResult<
  RhinoResourceSpecifierToResource<T>,
  Error,
  RhinoResourceSpecifierToResource<T>
> & {
  model: RhinoResource;
  resource: RhinoResourceSpecifierToResource<T> | null;
};

/**
 * Provides a mutation action to update an instance of the given model.
 * Invalidates all index and show queries related to the given model.
 *
 * @example
 *    const { isPending, mutate} = useModelUpdate('blog')
 *    const { isPending, mutate} = useModelUpdate('blog', { onSuccess: () => console.log('do something')})
 *    const { resource, model, mutate} = useModelUpdate('blog')
 */
export const useModelUpdate = <T extends RhinoResourceSpecifier>(
  model: T,
  mutationOptions: Partial<
    UseMutationOptions<
      RhinoResourceSpecifierToResource<T>,
      Error,
      RhinoResourceSpecifierToResource<T>
    >
  > = {}
): UseModelUpdateResults<T> => {
  const memoModel = useModel(model);
  const { invalidate } = useModelInvalidate(model);
  const build = useModelPathMemberBuild(model);

  const mutation = useMutation<
    RhinoResourceSpecifierToResource<T>,
    Error,
    RhinoResourceSpecifierToResource<T>
  >({
    mutationFn: (data) =>
      networkApiCallOnlyData(build(data), { method: 'patch', data }) as Promise<
        RhinoResourceSpecifierToResource<T>
      >,
    // @ts-expect-error FIXME we need to guarantee the identifier
    onSuccess: (data) => invalidate(data?.id),
    ...mutationOptions
  });

  const extraNames = useModelShowExtraNames(mutation);

  return { ...mutation, model: memoModel, ...extraNames };
};

export const useModelOptimisticUpdate = <T extends RhinoResourceSpecifier>(
  model: T,
  mutationOptions: Partial<
    UseMutationOptions<RhinoResourceSpecifierToResource<T>>
  > = {}
) => {
  const memoModel = useModel(model);
  const queryClient = useQueryClient();
  const modelKey = useModelKeyIndex(model);

  const mutation = useModelUpdate(model, {
    onMutate: async (newResource) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: modelKey });

      // Snapshot the previous values
      const previousResources = queryClient
        .getQueriesData({ queryKey: modelKey })
        .map((previousQuery) => {
          queryClient.setQueryData(
            previousQuery[0],
            (old: { results: RhinoRecord[] } | undefined) => {
              if (!old) return;

              const newData = cloneDeep(old);
              newData.results = newData.results.map((result) => {
                // We merge in case of a partial update
                // @ts-expect-error FIXME
                if (result.id === newResource.id)
                  return merge(result, newResource);

                return result;
              });
              return newData;
            }
          );

          return previousQuery;
        });

      // Return a context object with the snapshotted value
      return { previousResources };
    },
    onError: () => console.warn('Errors!'),
    onSettled: () => queryClient.invalidateQueries({ queryKey: modelKey }),
    ...mutationOptions
  });

  const extraNames = useModelShowExtraNames(mutation);

  return { ...mutation, model: memoModel, ...extraNames };
};

export type UseModelDeleteResults<T> = UseMutationResult<
  RhinoResourceSpecifierToResource<T>,
  Error,
  RhinoResourceSpecifierToResource<T> | number | string
> & {
  model: RhinoResource;
  resource: RhinoResourceSpecifierToResource<T> | null;
};

/**
 * Provides a mutation action to destroy an instance of the given model.
 * Invalidates all index queries for the given model.
 *
 * @example
 *    const { isPending, mutate} = useModelDelete('blog')
 *    const { isPending, mutate} = useModelDelete('blog', { onSuccess: () => console.log('do something')})
 *    const { resource, model, mutate} = useModelDelete('blog')
 */
export const useModelDelete = <T extends RhinoResourceSpecifier>(
  model: T,
  mutationOptions: Partial<
    UseMutationOptions<
      RhinoResourceSpecifierToResource<T>,
      Error,
      RhinoResourceSpecifierToResource<T> | number | string
    >
  > = {}
): UseModelDeleteResults<T> => {
  const memoModel = useModel(model);
  const { invalidate } = useModelInvalidateIndex(model);
  const build = useModelPathMemberBuild(model);

  const mutation = useMutation<
    RhinoResourceSpecifierToResource<T>,
    Error,
    RhinoResourceSpecifierToResource<T> | number | string
  >({
    mutationFn: (dataOrId) =>
      networkApiCallOnlyData(
        build(
          typeof dataOrId === 'string' || typeof dataOrId === 'number'
            ? { id: dataOrId }
            : dataOrId
        ),
        { method: 'delete' }
      ) as Promise<RhinoResourceSpecifierToResource<T>>,
    onSuccess: invalidate,
    ...mutationOptions
  });

  const extraNames = useModelShowExtraNames(mutation);

  return { ...mutation, model: memoModel, ...extraNames };
};

export type UseModelShowResults<T> = UseQueryResult<
  RhinoResourceSpecifierToResource<T>
> & {
  model: RhinoResource;
  resource: RhinoResourceSpecifierToResource<T> | null;
};

/**
 * Provides a query to fetch a particular instance of a model.
 *
 * @example
 *    const { isPending, resource} = useModelShow('blog', 1)
 *    const { isPending, resource} = useModelShow('blog', '1', { queryOptions: { onSuccess: () => console.log('do something') } })
 */
export const useModelShow = <T extends RhinoResourceSpecifier>(
  model: T,
  id: RhinoRecordIdentifier,
  options = {} as {
    networkOptions?: AxiosRequestConfig;
    queryOptions?: Partial<
      UseQueryOptions<RhinoResourceSpecifierToResource<T>>
    >;
  }
): UseModelShowResults<T> => {
  const { queryOptions, networkOptions } = options;
  const memoModel = useModel(model);
  const queryKey = useModelKeyShow(memoModel, id, []);
  const endpoint = useModelPathMember(model, { id });
  const query = useQuery({
    queryKey,
    queryFn: async ({ signal }) =>
      networkApiCallOnlyData(endpoint, {
        ...networkOptions,
        signal
      }) as Promise<RhinoResourceSpecifierToResource<T>>,
    ...queryOptions
  });

  const extraNames = useModelShowExtraNames(query);

  return {
    ...query,
    model: memoModel,
    ...extraNames
  };
};

const ALLOWED_INDEX_QUERY_OPTIONS = [
  'search',
  'filter',
  'order',
  'limit',
  'offset',
  'geospatial'
];

export type UseModelIndexOptions<T> = {
  filter?: Record<string, unknown>;
  geospatial?: Record<string, unknown>;
  order?: string;
  limit?: number;
  offset?: number;
  search?: string;
  networkOptions?: AxiosRequestConfig;
  queryOptions?: Partial<UseQueryOptions<RhinoResourceSpecifierToResource<T>>>;
};

export type UseModelIndexResults<T> = UseQueryResult<{
  results: RhinoResourceSpecifierToResource<T>[];
  total: number;
}> & {
  model: RhinoResource;
  results: RhinoResourceSpecifierToResource<T>[] | null;
  resources: {
    results: RhinoResourceSpecifierToResource<T>[];
    total: number;
  } | null;
  total: number | null;
};

/**
 * Provides a query to fetch a set of instances for the given model.
 *
 * @example
 *    const { isPending, resources} = useModelIndex('blog')
 *    const { isPending, resources} = useModelIndex('blog', { queryOptions: { onSuccess: () => console.log('do something') } })
 *    const { isPending, resources} = useModelIndex('blog', { filters: { published: true } })
 *    const { isPending, resources} = useModelIndex('blog', { order: 'created_at', limit: 10, offset: 10 })
 */
export const useModelIndex = <T extends RhinoResourceSpecifier>(
  model: T,
  options: UseModelIndexOptions<RhinoResourceSpecifierToResource<T>> = {}
): UseModelIndexResults<T> => {
  const { queryOptions } = options;
  const memoModel = useModel(model);
  const queryKey = useModelKeyIndex(model, [options]);
  const endpoint = useModelPathCollection(model);

  const networkOptions = useMemo(() => {
    const baseOptions = options.networkOptions || {};

    // Support direct search param injection
    // We don't unroll because we don't want to set undefined
    ALLOWED_INDEX_QUERY_OPTIONS.forEach((opt) => {
      // @ts-expect-error the key is guaranteed to be in the options
      if (has(options, opt)) set(baseOptions, `params.${opt}`, options[opt]);
    });

    return baseOptions;
  }, [options]);

  const query = useQuery({
    queryKey,
    queryFn: ({ signal }) =>
      networkApiCallOnlyData(endpoint, {
        ...networkOptions,
        signal
      }) as Promise<
        RhinoResourceSpecifierToResource<{
          results: RhinoResourceSpecifierToResource<T>[];
          total: number;
        }>
      >,
    ...queryOptions
  });

  const extraNames = useModelIndexExtraNames(query);

  return {
    ...query,
    model: memoModel,
    ...extraNames
  };
};
