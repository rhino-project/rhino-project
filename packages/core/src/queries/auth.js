import { useQueryClient, useMutation } from 'react-query';
import { networkApiCall } from 'rhino/lib/networking';

import {
  AUTH_ACCEPT_PATH,
  AUTH_BASE_PATH,
  AUTH_CREATE_END_POINT,
  AUTH_DESTROY_END_POINT,
  AUTH_PASSWORD_END_POINT,
  NetworkUnauthorizedError
} from 'rhino/lib/networking';
import { useAuth } from 'rhino/hooks/auth';
import { useMemo } from 'react';
import { getModuleInfo } from 'rhino/utils/models';

export const useSignInAction = () => {
  const { logIn } = useAuth();

  return useMutation(
    (data) => networkApiCall(AUTH_CREATE_END_POINT, { method: 'post', data }),
    {
      onSuccess: (data) => {
        logIn(data.data.data);
      }
    }
  );
};

export const useSignUpAction = () => {
  const { logIn } = useAuth();

  return useMutation(
    (data) => networkApiCall(AUTH_BASE_PATH, { method: 'post', data }),
    {
      onSuccess: (data) => {
        logIn(data.data.data);
      }
    }
  );
};

export const useSignupAllowed = () => {
  return useMemo(() => getModuleInfo('rhino')?.allow_signup, []);
};

export const useAcceptInvitationAction = () => {
  const { logIn } = useAuth();

  return useMutation(
    (data) => networkApiCall(AUTH_ACCEPT_PATH, { method: 'put', data }),
    {
      onSuccess: (data) => {
        logIn(data.data.data);
      }
    }
  );
};

export const useSignOutAction = () => {
  const queryClient = useQueryClient();
  const { logOut } = useAuth();

  return useMutation(
    () => {
      return networkApiCall(AUTH_DESTROY_END_POINT, {
        method: 'delete'
      });
    },
    {
      // Remove all but the session query to prevent cross-session caching
      onSettled: () => queryClient.removeQueries(),
      onSuccess: logOut,
      onError: (error) => {
        if (error instanceof NetworkUnauthorizedError) {
          logOut();
        }
      }
    }
  );
};

export const useUserUpdateAction = () => {
  return useMutation((data) =>
    networkApiCall(AUTH_BASE_PATH, { method: 'patch', data: data })
  );
};

export const useForgotPasswordAction = () => {
  return useMutation((data) =>
    networkApiCall(AUTH_PASSWORD_END_POINT, { method: 'post', data })
  );
};

export const useResetPasswordAction = () => {
  const { logIn } = useAuth();
  return useMutation(
    ({ data, headers }) =>
      networkApiCall(AUTH_PASSWORD_END_POINT, {
        method: 'patch',
        data,
        headers
      }),
    { onSuccess: (data) => logIn(data.data.data) }
  );
};
