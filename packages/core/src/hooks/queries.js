import { useQuery, useQueryClient, useMutation } from 'react-query';
import { cloneDeep, merge } from 'lodash';

import { networkApiCall } from 'rhino/lib/networking';
import { useModel } from 'rhino/hooks/models';
import { getModel } from 'rhino/utils/models';

export const modelKey = (model, action) =>
  `models-${model.pluralName}-${action}`;
export const modelKeyFromName = (name, action) =>
  modelKey(getModel(name), action);

// The mutation actions return a promise so that callers can perform actions
// after successful resolution.
// https://react-query.tanstack.com/guides/mutations#promises
//
// The mutation actions also refetch the obviously relevant queries

export const useModelCreate = (model, queryOptions = {}) => {
  const memoModel = useModel(model);
  const queryClient = useQueryClient();

  return useMutation(
    (data) => networkApiCall(memoModel.path, { method: 'post', data }),
    {
      onSuccess: () =>
        queryClient.invalidateQueries([modelKey(memoModel, 'index')]),
      ...queryOptions
    }
  );
};

export const useModelUpdate = (model, queryOptions = {}) => {
  const memoModel = useModel(model);
  const queryClient = useQueryClient();
  const isAccountModel = memoModel.model === 'account';

  return useMutation(
    (data) => {
      const endpoint = isAccountModel
        ? memoModel.path
        : `${memoModel.path}/${data.id}`;
      return networkApiCall(endpoint, {
        method: 'patch',
        data
      });
    },
    {
      // FIXME should this fetch the index too?
      onSuccess: (data) =>
        queryClient.invalidateQueries([
          modelKey(memoModel, 'show'),
          `${data?.data?.id}`
        ]),
      ...queryOptions
    }
  );
};

export const useModelOptimisticUpdate = (model, queryOptions = {}) => {
  const memoModel = useModel(model);
  const queryClient = useQueryClient();
  const queryIndexKey = modelKey(memoModel, 'index');

  return useModelUpdate(memoModel, {
    onMutate: async (newResource) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(queryIndexKey);

      // Snapshot the previous values
      const previousResources = queryClient
        .getQueriesData(queryIndexKey)
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

      // // Return a context object with the snapshotted value
      return { previousResources };
    },
    onError: () => console.log('Errors!'),
    onSettled: () => queryClient.invalidateQueries(queryIndexKey),
    ...queryOptions
  });
};

export const useModelDelete = (model, queryOptions = {}) => {
  const memoModel = useModel(model);
  const queryClient = useQueryClient();

  return useMutation(
    (id) => networkApiCall(memoModel.path + `/${id}`, { method: 'delete' }),
    {
      // FIXME should this fetch the show too?
      onSuccess: () =>
        queryClient.invalidateQueries([modelKey(memoModel, 'index')]),
      ...queryOptions
    }
  );
};

export const useModelShow = (model, id, options = {}, queryOptions = {}) => {
  const memoModel = useModel(model);
  const isAccountModel = memoModel.model === 'account';

  const key = [
    modelKey(memoModel, 'show'),
    isAccountModel ? null : `${id}`,
    options
  ].filter(Boolean);
  const endpoint = isAccountModel ? memoModel.path : memoModel.path + `/${id}`;

  return useQuery(
    key,
    () => {
      return networkApiCall(endpoint, options);
    },
    { ...queryOptions }
  );
};

export const useModelIndex = (model, options = {}, queryOptions = {}) => {
  const memoModel = useModel(model);

  return useQuery(
    [modelKey(memoModel, 'index'), options],
    () => networkApiCall(memoModel.path, options),
    { ...queryOptions }
  );
};
