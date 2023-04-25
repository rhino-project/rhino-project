import { useMemo } from 'react';
import {
  getAccountSettingsPath,
  getForgotPasswordPath,
  getRootPath,
  getSessionCreatePath,
  getSettingsPath,
  getUserCreatePath
} from 'rhino/utils/routes';
import { getModelCreatePath, getModelShowPath } from '../utils/routes';
import { useModel } from './models';

export const useRootPath = () => useMemo(() => getRootPath(), []);

export const useSessionCreatePath = () =>
  useMemo(() => getSessionCreatePath(), []);

export const useUserCreatePath = () => useMemo(() => getUserCreatePath(), []);

export const useForgotPasswordPath = () =>
  useMemo(() => getForgotPasswordPath(), []);

export const useSettingsPath = () => useMemo(() => getSettingsPath(), []);

export const useAccountSettingsPath = () =>
  useMemo(() => getAccountSettingsPath(), []);

export const useModelShowPath = (model, id) => {
  const memoModel = useModel(model);

  return useMemo(() => getModelShowPath(memoModel, id), [memoModel, id]);
};

export const useModelCreatePath = (model) => {
  const memoModel = useModel(model);

  return useMemo(() => getModelCreatePath(memoModel), [memoModel]);
};
