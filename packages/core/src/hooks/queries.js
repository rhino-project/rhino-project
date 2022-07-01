import { useQuery, useQueryClient, useMutation } from 'react-query';
import { cloneDeep, has, merge } from 'lodash';

import { networkApiCallOnlyData } from 'rhino/lib/networking';
import { useModel } from 'rhino/hooks/models';
import { getModel } from 'rhino/utils/models';
import { useCallback, useMemo } from 'react';

/**
 * @typedef {import('../utils/models.js').Model} Model
 * @typedef {import('react-query').QueryKey} QueryKey
 * @typedef {import('react-query').UseMutationOptions} UseMutationOptions
 * @typedef {import('react-query').UseMutationResult} UseMutationResult
 * @typedef {import('react-query').UseQueryOptions} UseQueryOptions
 * @typedef {import('react-query').UseQueryResult} UseQueryResult
 */

export const modelKey = (model, action) =>
  `models-${model.pluralName}-${action}`;
export const modelKeyFromName = (name, action) =>
  modelKey(getModel(name), action);

/**
 * @typedef {object} UseModelIndexExtraNamesResult
 * @property {?object} resources - the returned resources
 * @property {?object[]} results - the array of individual resource instances
 * @property {?number} total - the array of individual resource instances
 */

/**
 * Create extra memoized values to augment a model index query
 *
 * @param {UseQueryResult} query - results of useQuery for a model index query
 * @returns {UseModelIndexExtraNamesResult}
 * */
export const useModelIndexExtraNames = (query) => {
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
 * @typedef {object} UseModelShowExtraNamesResult
 * @property {object} resource - the returned resource
 */

/**
 * Create extra memoized values to augment a model show query or model mutation
 *
 * @param {UseQueryResult | UseMutationResult} query - results of useQuery for a model index query
 * @returns {UseModelShowExtraNamesResult}
 * */
export const useModelShowExtraNames = (query) => {
  const resource = useMemo(() => query?.data ?? null, [query.data]);

  const extraNames = useMemo(
    () => ({
      resource
    }),
    [resource]
  );

  return extraNames;
};

export const useModelPathMemberBuild = (model) => {
  const memoModel = useModel(model);

  const build = useCallback(
    (data) =>
      memoModel.singular ? memoModel.path : `${memoModel.path}/${data.id}`,
    [memoModel]
  );

  return build;
};

export const useModelPathMember = (model, data) => {
  const build = useModelPathMemberBuild(model);
  const path = useMemo(() => build(data), [build, data]);

  return path;
};

export const useModelPathCollection = (model) => {
  const memoModel = useModel(model);
  const path = useMemo(() => memoModel.path, [memoModel]);

  return path;
};

/**
 * Creates a memoized query key for the given model and action
 *
 * @param {string | Model } model - The model name or model
 * @param {'index' | 'show'} action - The action (index or show)
 * @param {string[]} extraKeys - extraKeys to add to the model key
 * @returns {QueryKey} - array of strings for a query key
 * @example
 *    const model = useModelKey('blog', 'show')
 *    const model = useModelKey('blog', 'index')
 *    const model = useModelKey('blog', 'index', ['search=test'])
 *    const model = useModelKey(getModel('blog'), 'show')
 */
export const useModelKey = (model, action, extraKeys = []) => {
  const memoModel = useModel(model);

  const queryKey = useMemo(() => [modelKey(memoModel, action), ...extraKeys], [
    memoModel,
    action,
    extraKeys
  ]);

  return queryKey;
};

/**
 * Creates a memoized query key for the index action of the given model
 *
 * @param {string | Model } model - The model name or model
 * @param {string[]} extraKeys - extraKeys to add to the model key
 * @returns {QueryKey} - array of strings for a query key
 * @example
 *    const queryKey = useModelKeyIndex('blog')
 *    const queryKey = useModelKeyIndex('blog', ['search=test'])
 *    const queryKey = useModelKeyIndex(getModel('blog'))
 */
export const useModelKeyIndex = (model, extraKeys = []) => {
  const modelKey = useModelKey(model, 'index', extraKeys);

  return modelKey;
};

/**
 * @typedef {function(number | string): QueryKey} UseModelKeyShowBuilder
 */

/**
 * @typedef {object} UseModelKeyShowBuildResult
 * @property {UseModelKeyShowBuilder} build - function to generate the show key
 */

/**
 * Provides a memoized function to construct a query key for the show action of the given model id.
 * Useful when the 'id' of a model instance is not known until later, such as during a mutation.
 *
 * @param {string | Model } model - The model name or model
 * @param {string[]} extraKeys - extraKeys to add to the model key
 * @returns {UseModelKeyShowBuildResult} - function to generate key
 * @example
 ```
  // Get the builder
  const { build } = useModelKeyShowBuild('blog');
  //...hack hack hack...
  // Later build the query key
  const queryKey = build(3);
  ```
 */
export const useModelKeyShowBuild = (model, extraKeys = []) => {
  const modelKey = useModelKey(model, 'show');

  // Always ensure the id is a string for consistency
  // Singular model has no id key
  const build = useCallback(
    (id) =>
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
 * @param {string | Model } model - The model name or model
 * @param {string[]} extraKeys - extraKeys to add to the model key
 * @returns {QueryKey} - array of strings for a query key
 * @example
 *    const queryKey = useModelKeyShow('blog', '3')
 *    const queryKey = useModelKeyShow('blog', 3, ['search=test'])
 *    const queryKey = useModelKeyShow(getModel('blog'), 3)
 */
export const useModelKeyShow = (model, id, extraKeys = []) => {
  const { build } = useModelKeyShowBuild(model, extraKeys);
  const modelKey = useMemo(() => build(id), [build, id]);

  return modelKey;
};

/**
 * @typedef {function(): Promise} UseModelInvalidateIndexInvalidator
 */

/**
 * Returns a callback to invalidate index queries for the given model.
 *
 * @param {string | Model } model - The model name or model
 * @param {string[]} extraKeys - extraKeys to add to the query key
 * @returns {UseModelInvalidateIndexInvalidator} - array of strings for a query key
 * @example
 ```
 const { mutate } = useModelUpdate('blog')
 const { invalidate } = useModelInvalidateIndex('blog_post')

// After updating the blog, invalidate related blog post queries
 mutate({ id: 3, published: false }, { onSuccess: invalidate })
 ```
 */
export const useModelInvalidateIndex = (model, extraKeys = []) => {
  const queryClient = useQueryClient();
  const modelKey = useModelKeyIndex(model, extraKeys);

  const invalidate = useCallback(
    () => queryClient.invalidateQueries(modelKey),
    [queryClient, modelKey]
  );

  return { invalidate, invalidateIndex: invalidate };
};

/**
 * @typedef {function(number | string): Promise} UseModelInvalidateShowInvalidator
 */

/**
 * Returns a callback to invalidate show queries for the given model instance
 *
 * @param {string | Model } model - The model name or model
 * @param {string[]} extraKeys - extraKeys to add to the query key
 * @returns {UseModelInvalidateShowInvalidator} - array of strings for a query key
 * @example
 ```
 const { mutate } = useModelUpdate('blog')
 const { invalidate } = useModelInvalidateShow('blog_post')

 // After updating the blog, invalidate related show queries for a blog post
 mutate({ id: 3, published: false }, { onSuccess: () => invalidate(7) })
 ```
 */
export const useModelInvalidateShow = (model, extraKeys = []) => {
  const queryClient = useQueryClient();
  const { build } = useModelKeyShowBuild(model, extraKeys);

  const invalidate = useCallback(
    (id) => queryClient.invalidateQueries(build(id)),
    [queryClient, build]
  );

  return { invalidate, invalidateShow: invalidate };
};

/**
 * @typedef {function(number | string): Promise} useModelInvalidateInvalidator
 */

/**
 * Returns a callback to invalidate index and show queries for the given model and model instance
 *
 * @param {string | Model } model - The model name or model
 * @param {string[]} extraIndexKeys - extraKeys to add to the index query key
 * @param {string[]} extraShowKeys - extraKeys to add to the show query key
 * @returns {useModelInvalidateInvalidator} - array of strings for a query key
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
  model,
  { extraIndexKeys = [], extraShowKeys = [] } = {}
) => {
  const { invalidateIndex } = useModelInvalidateIndex(model, extraIndexKeys);
  const { invalidateShow } = useModelInvalidateShow(model, extraShowKeys);

  const invalidate = useCallback(
    async (id) => Promise.all([invalidateShow(id), invalidateIndex()]),
    [invalidateIndex, invalidateShow]
  );

  return { invalidate };
};

// The mutation actions return a promise so that callers can perform actions
// after successful resolution.
// https://react-query.tanstack.com/guides/mutations#promises
//
// The mutation actions also invalidate the obviously relevant queries

/**
 * @typedef {object} UseModelCreateResultExtension
 * @property {Model} model - the memoized model for the mutation
 */

/**
 * @typedef {UseMutationResult & UseModelShowExtraNamesResult & UseModelCreateResultExtension} UseModelCreateResult
 */

/**
 * Provides a mutation action to create an instance of the given model.
 * Invalidates all index queries related to the given model.
 *
 * @param {string | Model } model - The model name or model
 * @param {UseMutationOptions} [mutationOptions={}] - The action (index or show)
 * @returns {UseModelCreateResult}
 * @example
 *    const { isLoading, mutate} = useModelCreate('blog')
 *    const { isLoading, mutate} = useModelCreate('blog', { onSuccess: () => console.log('do something')})
 *    const { resource, model, mutate} = useModelCreate('blog')
 */
export const useModelCreate = (model, mutationOptions = {}) => {
  const memoModel = useModel(model);
  const { invalidate } = useModelInvalidateIndex(model);
  const endpoint = useModelPathCollection(model);

  const mutation = useMutation({
    mutationFn: (data) =>
      networkApiCallOnlyData(endpoint, { method: 'post', data }),
    onSuccess: invalidate,
    ...mutationOptions
  });

  const extraNames = useModelShowExtraNames(mutation);

  return { ...mutation, model: memoModel, ...extraNames };
};

/**
 * @typedef {object} UseModelUpdateResultExtension
 * @property {Model} model - the memoized model for the mutation
 */

/**
 * @typedef {UseMutationResult & UseModelShowExtraNamesResult & UseModelUpdateResultExtension} UseModelUpdateResult
 */

/**
 * Provides a mutation action to update an instance of the given model.
 * Invalidates all index and show queries related to the given model.
 *
 * @param {string | Model } model - The model name or model
 * @param {UseMutationOptions} [mutationOptions={}] - The action (index or show)
 * @returns {UseModelUpdateResult}
 * @example
 *    const { isLoading, mutate} = useModelUpdate('blog')
 *    const { isLoading, mutate} = useModelUpdate('blog', { onSuccess: () => console.log('do something')})
 *    const { resource, model, mutate} = useModelUpdate('blog')
 */
export const useModelUpdate = (model, mutationOptions = {}) => {
  const memoModel = useModel(model);
  const { invalidate } = useModelInvalidate(model);
  const build = useModelPathMemberBuild(model);

  const mutation = useMutation({
    mutationFn: (data) =>
      networkApiCallOnlyData(build(data), { method: 'patch', data }),
    onSuccess: (data) => invalidate(data?.id),
    ...mutationOptions
  });

  const extraNames = useModelShowExtraNames(mutation);

  return { ...mutation, model: memoModel, ...extraNames };
};

export const useModelOptimisticUpdate = (model, mutationOptions = {}) => {
  const memoModel = useModel(model);
  const queryClient = useQueryClient();
  const modelKey = useModelKeyIndex(model);

  const mutation = useModelUpdate(memoModel, {
    onMutate: async (newResource) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(modelKey);

      // Snapshot the previous values
      const previousResources = queryClient
        .getQueriesData(modelKey)
        .map((previousQuery) => {
          queryClient.setQueryData(previousQuery[0], (old) => {
            if (!old) return;

            const newData = cloneDeep(old);
            newData.data.results = newData.data.results.map((result) => {
              // We merge in case of a partial update
              if (result.id === newResource.id)
                return merge(result, newResource);

              return result;
            });
            return newData;
          });

          return previousQuery;
        });

      // Return a context object with the snapshotted value
      return { previousResources };
    },
    onError: () => console.warn('Errors!'),
    onSettled: () => queryClient.invalidateQueries(modelKey),
    ...mutationOptions
  });

  const extraNames = useModelShowExtraNames(mutation);

  return { ...mutation, model: memoModel, ...extraNames };
};

/**
 * @typedef {object} UseModelDeleteResultExtension
 * @property {Model} model - the memoized model for the mutation
 */

/**
 * @typedef {UseMutationResult & UseModelShowExtraNamesResult & UseModelDeleteResultExtension} UseModelDeleteResult
 */

/**
 * Provides a mutation action to destroy an instance of the given model.
 * Invalidates all index queries for the given model.
 *
 * @param {string | Model } model - The model name or model
 * @param {UseMutationOptions} [mutationOptions={}] - The action (index or show)
 * @returns {UseModelDeleteResult}
 * @example
 *    const { isLoading, mutate} = useModelDelete('blog')
 *    const { isLoading, mutate} = useModelDelete('blog', { onSuccess: () => console.log('do something')})
 *    const { resource, model, mutate} = useModelDelete('blog')
 */
export const useModelDelete = (model, mutationOptions = {}) => {
  const memoModel = useModel(model);
  const { invalidate } = useModelInvalidateIndex(model);
  const build = useModelPathMemberBuild(model);

  const mutation = useMutation({
    mutationFn: (id) =>
      networkApiCallOnlyData(build({ id }), { method: 'delete' }),
    onSuccess: invalidate,
    ...mutationOptions
  });

  const extraNames = useModelShowExtraNames(mutation);

  return { ...mutation, model: memoModel, ...extraNames };
};

/**
 * @typedef {object} UseModelShowResultExtension
 * @property {Model} model - the memoized model for the mutation
 */

/**
 * @typedef {object} UseModelShowResultOptions
 * @property {object} [networkOptions={}] - Axios option
 * @property {UseQueryOptions} [queryOptions={}] - The action (index or show)
 */

/**
 * @typedef {UseQueryResult & UseModelShowExtraNamesResult & UseModelShowResultExtension} UseModelShowResult
 */

/**
 * Provides a query to fetch a particular instance of a model.
 *
 * @param {string | Model } model - The model name or model
 * @param {number | string} id - The id of the model instance to retrieve
 * @param {?UseModelShowResultOptions} [options={}] - Show options
 * @returns {UseModelShowResult}
 * @example
 *    const { isLoading, resource} = useModelShow('blog', 1)
 *    const { isLoading, resource} = useModelShow('blog', '1', { queryOptions: { onSuccess: () => console.log('do something') } })
 */
export const useModelShow = (model, id, options = {}, ...legacyOptions) => {
  const memoModel = useModel(model);
  const queryKey = useModelKeyShow(memoModel, id, [options]);
  const endpoint = useModelPathMember(model, { id });

  // If it has either of these and not a fourth param, its the newer options setup
  const isLegacy = useMemo(
    () =>
      (Object.keys(options).length > 0 &&
        !has(options, 'queryOptions') &&
        !has(options, 'networkOptions')) ||
      legacyOptions.length > 0,
    [options, legacyOptions]
  );
  if (isLegacy) console.warn('useModelShow passed legacy options');

  const networkOptions = useMemo(
    () => (isLegacy ? options : options.networkOptions || {}),
    [isLegacy, options]
  );
  const queryOptions = useMemo(
    () => (isLegacy ? legacyOptions[0] : options.queryOptions) || {},
    [isLegacy, legacyOptions, options.queryOptions]
  );
  // End of legacy handling

  const query = useQuery({
    queryKey,
    queryFn: () => networkApiCallOnlyData(endpoint, networkOptions),
    ...queryOptions
  });

  const extraNames = useModelShowExtraNames(query);

  return {
    ...query,
    model: memoModel,
    ...extraNames
  };
};

/**
 * @typedef {object} UseModelIndexResultExtension
 * @property {Model} model - the memoized model for the mutation
 */

/**
 * @typedef {object} UseModelIndexResultOptions
 * @property {object} [networkOptions={}] - Axios option
 * @property {UseQueryOptions} [queryOptions={}] - The action (index or show)
 */

/**
 * @typedef {UseQueryResult & UseModelIndexExtraNamesResult & UseModelIndexResultExtension} UseModelIndexResult
 */

/**
 * Provides a query to fetch a set of instances for the given model.
 *
 * @param {string | Model } model - The model name or model
 * @param {?UseModelIndexResultOptions} [options={}] - Index options
 * @returns {UseModelIndexResult}
 * @example
 *    const { isLoading, resources} = useModelIndex('blog')
 *    const { isLoading, resource} = useModelIndex('blog', { queryOptions: { onSuccess: () => console.log('do something') } })
 *    const { isLoading, resource} = useModelIndex('blog', { networkOptions: { params: {filters: { published: true } } } })
 */
export const useModelIndex = (model, options = {}, ...legacyOptions) => {
  const memoModel = useModel(model);
  const queryKey = useModelKeyIndex(model, [options]);
  const endpoint = useModelPathCollection(model);

  // If it has either of these and not a fourth param, its the newer options setup
  const isLegacy = useMemo(
    () =>
      (Object.keys(options).length > 0 &&
        !has(options, 'queryOptions') &&
        !has(options, 'networkOptions')) ||
      legacyOptions.length > 0,
    [options, legacyOptions]
  );
  if (isLegacy) console.warn('useModelIndex passed legacy options');

  const networkOptions = useMemo(
    () => (isLegacy ? options : options.networkOptions || {}),
    [isLegacy, options]
  );
  const queryOptions = useMemo(
    () => (isLegacy ? legacyOptions[0] : options.queryOptions) || {},
    [isLegacy, legacyOptions, options.queryOptions]
  );
  // End of legacy handling

  const query = useQuery({
    queryKey,
    queryFn: () => networkApiCallOnlyData(endpoint, networkOptions),
    ...queryOptions
  });

  const extraNames = useModelIndexExtraNames(query);

  return {
    ...query,
    model: memoModel,
    ...extraNames
  };
};
