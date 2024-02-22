import { useMemo } from 'react';
import {
  getAccountSettingsPath,
  getAuthenticatedAppPath,
  getForgotPasswordPath,
  getModelEditPath,
  getModelIndexPath,
  getNonAuthenticatedAppPath,
  getRootPath,
  getSessionCreatePath,
  getSettingsPath,
  getUserCreatePath,
} from '../utils/routes';
import { getModelCreatePath, getModelShowPath } from '../utils/routes';
import { useModel } from './models';

export const useRootPath = () => useMemo(() => getRootPath(), []);
export const useAuthenticatedAppPath = () =>
  useMemo(() => getAuthenticatedAppPath(), []);

export const useSessionCreatePath = ({ absolute } = { absolute: false }) =>
  useMemo(
    () =>
      absolute
        ? `${getNonAuthenticatedAppPath()}/${getSessionCreatePath()}`
        : getSessionCreatePath(),
    [absolute]
  );

export const useUserCreatePath = () => useMemo(() => getUserCreatePath(), []);

export const useForgotPasswordPath = () =>
  useMemo(() => getForgotPasswordPath(), []);

export const useSettingsPath = () => useMemo(() => getSettingsPath(), []);

export const useAccountSettingsPath = () =>
  useMemo(() => getAccountSettingsPath(), []);

export const useModelIndexPath = (model) => {
  const memoModel = useModel(model);

  return useMemo(() => getModelIndexPath(memoModel), [memoModel]);
};

export const useModelShowPath = (model, id) => {
  const memoModel = useModel(model);

  return useMemo(() => getModelShowPath(memoModel, id), [memoModel, id]);
};

export const useModelCreatePath = (model) => {
  const memoModel = useModel(model);

  return useMemo(() => getModelCreatePath(memoModel), [memoModel]);
};

export const useModelEditPath = (model, id) => {
  const memoModel = useModel(model);

  return useMemo(() => getModelEditPath(memoModel, id), [memoModel, id]);
};
