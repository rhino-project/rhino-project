import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@rhino-project/core/contexts';
import { useAuth } from '@rhino-project/core/hooks';
import {
  AUTH_BASE_PATH,
  AUTH_CREATE_END_POINT,
  AUTH_DESTROY_END_POINT,
  AUTH_VALIDATE_TOKEN_END_POINT,
  constructPath
} from '@rhino-project/core/lib/networking';

const defaultUser = {
  id: 1,
  name: '...',
  email: 'aaa@aaa.com'
};

export class NetworkingMock {
  axiosResult = {
    // [API_ROOT_PATH]: {
    // 'post': () => promise with result
    // 'delete': () => promise with result
    // }
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
    const fullPath = constructPath(path);
    if (this.axiosResult[fullPath] == null) {
      this.axiosResult[fullPath] = {};
    }
    this.axiosResult[fullPath][`__${method}`] = () => {
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
    const fullPath = constructPath(path);
    if (this.axiosResult[fullPath] == null) {
      this.axiosResult[fullPath] = {};
    }
    this.axiosResult[fullPath][`__${method}`] = () =>
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
    function AuthWrapper({ children }) {
      return (
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
      );
    }

    this.mockValidateSessionSuccess(user);
    const view = renderHook(
      () => ({
        auth: useAuth(),
        main: hook()
      }),
      {
        wrapper: AuthWrapper
      }
    );

    expect(view.result.current.auth.resolving).toBe(true);
    expect(view.result.current.auth.user).toBeNull();

    await waitFor(() => expect(view.result.current.auth.resolving).toBe(false));
    expect(view.result.current.auth.user).toEqual(user);

    return view;
  }

  async produceUnauthenticatedState({ queryClient, hook = () => null }) {
    function AuthWrapper({ children }) {
      return (
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
      );
    }

    this.mockValidateSessionFailure();
    const view = renderHook(
      () => ({
        auth: useAuth(),
        main: hook()
      }),
      {
        wrapper: AuthWrapper
      }
    );
    expect(view.result.current.auth.resolving).toBe(true);
    expect(view.result.current.auth.user).toBeNull();

    // wait for the hook to resolve
    await waitFor(() => expect(view.result.current.auth.resolving).toBe(false));
    expect(view.result.current.auth.user).toBeNull();

    return view;
  }
}
