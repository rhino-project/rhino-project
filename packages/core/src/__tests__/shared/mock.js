import { waitFor } from '@testing-library/dom';
import { renderHook } from '@testing-library/react-hooks/dom';
import env from 'config';
import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from 'rhino/contexts/AuthContext';
import { useAuth } from 'rhino/hooks/auth';
import {
  AUTH_BASE_PATH,
  AUTH_CREATE_END_POINT,
  AUTH_DESTROY_END_POINT,
  AUTH_VALIDATE_TOKEN_END_POINT
} from 'rhino/lib/networking';

const defaultUser = {
  id: 1,
  name: '...',
  email: 'aaa@aaa.com'
};

export class NetworkingMock {
  axiosResult = {
    [env.API_ROOT_PATH]: {
      // 'post': () => promise with result
      // 'delete': () => promise with result
    }
  };

  axiosMockImplementation() {
    return (path, config) => {
      if (
        this.axiosResult[path] == null ||
        this.axiosResult[path][`__${config.method}`] == null
      ) {
        throw new Error(`Endpoint not mocked: ${config.method} <> ${path}`);
      }
      return this.axiosResult[path][`__${config.method}`]();
    };
  }

  _mockSuccess({ data, path, method }) {
    if (this.axiosResult[`${env.REACT_APP_API_ROOT_PATH}/${path}`] == null) {
      this.axiosResult[`${env.REACT_APP_API_ROOT_PATH}/${path}`] = {};
    }
    this.axiosResult[`${env.REACT_APP_API_ROOT_PATH}/${path}`][`__${method}`] =
      () => {
        return new Promise((resolve) =>
          setTimeout(() => {
            resolve({
              data: { data }
            });
          }, 100)
        );
      };
  }

  _mockFailure({ path, method, status, errors = {} }) {
    if (this.axiosResult[`${env.REACT_APP_API_ROOT_PATH}/${path}`] == null) {
      this.axiosResult[`${env.REACT_APP_API_ROOT_PATH}/${path}`] = {};
    }
    this.axiosResult[`${env.REACT_APP_API_ROOT_PATH}/${path}`][`__${method}`] =
      () =>
        new Promise((resolve, reject) =>
          setTimeout(
            () =>
              reject({
                response: { status, data: { errors } }
              }),
            100
          )
        );
  }

  mockValidateSessionSuccess(user) {
    this._mockSuccess({
      data: user,
      path: AUTH_VALIDATE_TOKEN_END_POINT,
      method: 'get'
    });
  }

  mockValidateSessionFailure() {
    this._mockFailure({
      path: AUTH_VALIDATE_TOKEN_END_POINT,
      method: 'get',
      status: 401
    });
  }

  mockSignInSuccess(user = defaultUser) {
    this._mockSuccess({
      data: user,
      path: AUTH_CREATE_END_POINT,
      method: 'post'
    });
  }

  mockSignInFailure() {
    this._mockFailure({
      path: AUTH_CREATE_END_POINT,
      method: 'post',
      status: 401
    });
  }

  mockSignUpSuccess(user = defaultUser) {
    this._mockSuccess({ data: user, path: AUTH_BASE_PATH, method: 'post' });
  }

  mockSignUpFailure() {
    this._mockFailure({ path: AUTH_BASE_PATH, method: 'post', status: 401 });
  }

  mockSignOutSuccess() {
    this._mockSuccess({ path: AUTH_DESTROY_END_POINT, method: 'delete' });
    this.mockValidateSessionFailure();
  }

  mockSignOutFailure(status = 400) {
    this._mockFailure({
      path: AUTH_DESTROY_END_POINT,
      method: 'delete',
      status
    });
  }

  async produceAuthenticatedState({
    queryClient,
    hook = () => null,
    user = defaultUser
  }) {
    // eslint-disable-next-line react/prop-types
    function AuthWrapper({ children }) {
      return (
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
      );
    }

    this.mockValidateSessionSuccess(user);
    const renderedHook = renderHook(
      () => ({
        auth: useAuth(),
        main: hook()
      }),
      {
        wrapper: AuthWrapper
      }
    );
    await waitFor(() => {
      expect(renderedHook.result.current.auth.resolving).toBe(true);
      expect(renderedHook.result.current.auth.user).toBeNull();
    });
    await waitFor(() => {
      expect(renderedHook.result.current.auth.resolving).toBe(false);
      expect(renderedHook.result.current.auth.user).toEqual(user);
    });

    return renderedHook;
  }

  async produceUnauthenticatedState({ queryClient, hook = () => null }) {
    // eslint-disable-next-line react/prop-types
    function AuthWrapper({ children }) {
      return (
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
      );
    }

    this.mockValidateSessionFailure();
    const renderedHook = renderHook(
      () => ({
        auth: useAuth(),
        main: hook()
      }),
      {
        wrapper: AuthWrapper
      }
    );
    expect(renderedHook.result.current.auth.resolving).toBe(true);
    expect(renderedHook.result.current.auth.user).toBeNull();
    await renderedHook.waitForNextUpdate();
    expect(renderedHook.result.current.auth.resolving).toBe(false);
    expect(renderedHook.result.current.auth.user).toBeNull();
    return renderedHook;
  }
}
