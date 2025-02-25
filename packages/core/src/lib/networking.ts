import axios, { AxiosRequestConfig } from 'axios';
import qs from 'qs';
import * as networking from './networking.js';
import { toastStore } from '../queries/toast';

export const AUTH_BASE_PATH = '/api/auth';
export const AUTH_ACCEPT_PATH = `${AUTH_BASE_PATH}/invitation`;
export const AUTH_CREATE_END_POINT = AUTH_BASE_PATH + '/sign_in';
export const AUTH_DESTROY_END_POINT = AUTH_BASE_PATH + '/sign_out';
export const AUTH_PASSWORD_END_POINT = AUTH_BASE_PATH + '/password';
export const AUTH_VALIDATE_TOKEN_END_POINT = AUTH_BASE_PATH + '/validate_token';
export const AUTH_SESSION_KEY = ['session'];

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
};

const _buildHeaders = (headers = {}) => {
  return { ...DEFAULT_HEADERS, ...headers };
};

export class NetworkUnauthorizedError extends Error {
  constructor(message?: string) {
    super(message);

    this.name = 'NetworkUnauthorizedError';
  }
}

export class NetworkParamError extends Error {
  // FIXME: more specific type
  public errors: string[] | Record<string, string[]>;

  constructor(errors: string[] | Record<string, string[]>, message?: string) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(message);

    this.name = 'NetworkParamError';
    this.errors = errors;
  }
}

export const networkApiCall = (path: string, options: AxiosRequestConfig) => {
  const defaultOptions = {
    method: 'get',
    headers: {},
    data: null,
    signal: null,
    ...options
  } as AxiosRequestConfig;

  return axios(path, {
    ...defaultOptions,
    headers: _buildHeaders(defaultOptions.headers),
    paramsSerializer: {
      serialize: (params) => qs.stringify(params, { arrayFormat: 'brackets' })
    },
    withCredentials: true
  }).catch((error) => {
    if (
      ((error.response.status === 401 || error.response.status === 403) &&
        (!path.startsWith(AUTH_BASE_PATH) ||
          path === AUTH_VALIDATE_TOKEN_END_POINT)) ||
      (error.response.status === 404 && path === AUTH_DESTROY_END_POINT)
    ) {
      // If the response is 401 or 403 (and not part of authenticating (other
      // than token validation), invalidate the session
      throw new NetworkUnauthorizedError();
    } else if (error.response.status === 500) {
      // If its a 500 throw up a toast
      // FIXME De-duplicate these
      toastStore.add({
        icon: 'danger',
        title: 'Request Error',
        description: 'Sorry, the server returned an error during your request'
      });
    } else if (error.response.data?.errors) {
      // If its a "regular" error, pass the messages back to the user
      throw new NetworkParamError(error.response.data?.errors);
    }
  });
};

export const networkApiCallOnlyData = async (
  path: string,
  options = {} as AxiosRequestConfig
) => {
  // Will have data if no error
  const response = (await networking.networkApiCall(path, options)) as {
    data: unknown;
  };

  return response.data;
};
