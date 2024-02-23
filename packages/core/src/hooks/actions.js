import { networkApiCallOnlyData } from '../lib/networking';
import { useCallback, useMemo } from 'react';
import {
  useModelCreate,
  useModelDelete,
  useModelIndex,
  useModelKeyShow,
  useModelPathMember,
  useModelPathMemberBuild,
  useModelShow,
  useModelUpdate
} from './queries.js';

export const useModelMutationAction = (
  model,
  action,
  useMutationAction,
  method,
  mutationOptions = {}
) => {
  const build = useModelPathMemberBuild(model);

  const mutationFn = useCallback(
    (data) => {
      const endpoint = `${build(data)}/${action}`;

      return networkApiCallOnlyData(endpoint, { method, data });
    },
    [action, build, method]
  );

  const mutation = useMutationAction(model, {
    mutationFn,
    ...mutationOptions
  });

  return mutation;
};

export const useModelQueryAction = (
  model,
  id,
  action,
  useQueryAction,
  { queryOptions = {}, networkOptions = {}, ...restOptions }
) => {
  const baseEndpoint = useModelPathMember(model, { id });
  const endpoint = useMemo(
    () => `${baseEndpoint}/${action}`,
    [action, baseEndpoint]
  );

  // This looks like the useModelShow key with the addition of the action
  const extraQueryKeys = useMemo(
    () => ({ ...queryOptions, ...networkOptions, ...restOptions }),
    [queryOptions, networkOptions, restOptions]
  );
  const queryKey = useModelKeyShow(model, id, [action, extraQueryKeys]);

  // The endpoint is of the form /api/<model>/<model-id>/<action>
  const queryFn = useCallback(
    ({ signal }) =>
      networkApiCallOnlyData(endpoint, { ...networkOptions, signal }),
    [endpoint, networkOptions]
  );

  const query = useQueryAction(model, id, {
    queryOptions: {
      queryFn,
      queryKey,
      ...queryOptions
    },
    ...restOptions
  });

  return query;
};

export const useModelActionCreate = (model, action, mutationOptions = {}) => {
  const mutation = useModelMutationAction(
    model,
    action,
    useModelCreate,
    'post',
    mutationOptions
  );

  return mutation;
};

export const useModelActionUpdate = (model, action, mutationOptions = {}) => {
  const mutation = useModelMutationAction(
    model,
    action,
    useModelUpdate,
    'patch',
    mutationOptions
  );

  return mutation;
};

// FIXME - this won't quite work, but useModelDelete should be fixed to take both an id and object for deletion
// instead of just an id
export const useModelActionDelete = (model, action, mutationOptions = {}) => {
  const mutation = useModelMutationAction(
    model,
    action,
    useModelDelete,
    'delete',
    mutationOptions
  );

  return mutation;
};

export const useModelActionShow = (model, id, action, options = {}) => {
  const query = useModelQueryAction(model, id, action, useModelShow, options);

  return query;
};

// We must drop the 'id' parameter
export const useModelIndexActionWrapper = (model, id, options) =>
  useModelIndex(model, options);

export const useModelActionIndex = (model, id, action, options = {}) => {
  const query = useModelQueryAction(
    model,
    id,
    action,
    useModelIndexActionWrapper,
    options
  );

  return query;
};
