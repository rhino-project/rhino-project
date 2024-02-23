import { useQueryClient, useMutation } from '@tanstack/react-query';
import { networkApiCall } from '../lib/networking';

import {
  AUTH_ACCEPT_PATH,
  AUTH_BASE_PATH,
  AUTH_CREATE_END_POINT,
  AUTH_DESTROY_END_POINT,
  AUTH_PASSWORD_END_POINT,
  NetworkUnauthorizedError,
} from '../lib/networking';
import { useAuth } from '../hooks/auth';
import { useMemo } from 'react';
import { getModuleInfo } from '../utils/models';

export const useSignInAction = () => {
  const { logIn } = useAuth();

  return useMutation({
    mutationFn: (data) =>
      networkApiCall(AUTH_CREATE_END_POINT, { method: 'post', data }),
    onSuccess: (data) => {
      logIn(data.data.data);
    }
  });
};

export const useSignUpAction = () => {
  const { logIn } = useAuth();

  return useMutation({
    mutationFn: (data) =>
      networkApiCall(AUTH_BASE_PATH, { method: 'post', data }),
    onSuccess: (data) => {
      logIn(data.data.data);
    }
  });
};

export const useSignupAllowed = () => {
  return useMemo(() => getModuleInfo('rhino')?.allow_signup, []);
};

export const useAcceptInvitationAction = () => {
  const { logIn } = useAuth();

  return useMutation({
    mutationFn: (data) =>
      networkApiCall(AUTH_ACCEPT_PATH, { method: 'put', data }),
    onSuccess: (data) => {
      logIn(data.data.data);
    }
  });
};

export const useSignOutAction = () => {
  const queryClient = useQueryClient();
  const { logOut } = useAuth();

  return useMutation({
    mutationFn: () =>
      networkApiCall(AUTH_DESTROY_END_POINT, {
        method: 'delete'
      }),
    onSettled: () => queryClient.removeQueries(),
    onSuccess: logOut,
    onError: (error) => {
      if (error instanceof NetworkUnauthorizedError) {
        logOut();
      }
    }
  });
};

export const useUserUpdateAction = () => {
  return useMutation({
    mutationFn: (data) =>
      networkApiCall(AUTH_BASE_PATH, { method: 'patch', data: data })
  });
};

export const useForgotPasswordAction = () => {
  return useMutation({
    mutationFn: (data) =>
      networkApiCall(AUTH_PASSWORD_END_POINT, { method: 'post', data })
  });
};

export const useResetPasswordAction = () => {
  const { logIn } = useAuth();
  return useMutation({
    mutationFn: ({ data, headers }) =>
      networkApiCall(AUTH_PASSWORD_END_POINT, {
        method: 'patch',
        data,
        headers
      }),
    onSuccess: (data) => logIn(data.data.data)
  });
};
