import axios from 'axios';
import qs from 'qs';
import * as networking from './networking.js';

import env from 'config';
import { toastStore } from 'rhino/queries/toast';

const REACT_APP_API_ROOT_PATH = env.REACT_APP_API_ROOT_PATH;
export const AUTH_BASE_PATH = 'api/auth';
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

export const constructPath = (path) =>
  new URL(path, REACT_APP_API_ROOT_PATH).toString();

const _buildHeaders = (headers = {}) => {
  return { ...DEFAULT_HEADERS, ...headers };
};

export class NetworkUnauthorizedError extends Error {
  constructor(...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    this.name = 'NetworkUnauthorizedError';
  }
}

export class NetworkParamError extends Error {
  constructor(errors, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    this.name = 'NetworkParamError';
    this.errors = errors;
  }
}

export const networkApiCall = (path, options) => {
  const defaultOptions = {
    method: 'get',
    headers: {},
    data: null,
    signal: null,
    ...options
  };

  return axios(constructPath(path), {
    ...defaultOptions,
    headers: _buildHeaders(defaultOptions.headers),
    paramsSerializer: {
      serialize: (params) => qs.stringify(params, { arrayFormat: 'brackets' })
    },
    withCredentials: true
  }).catch((error) => {
    if (
      ((error.response.status === 401 || error.response.status === 403) &&
        (!path.startsWith('api/auth') || path === 'api/auth/validate_token')) ||
      (error.response.status === 404 && path === 'api/auth/sign_out')
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

const handler = {
  get(target, prop, receiver) {
    // If the data is being access data.data, its the older form, return it
    if (prop === 'data') {
      console.warn('Legacy data access used in query hooks');

      return target;
    }
    return Reflect.get(...arguments);
  }
};

export const networkApiCallOnlyData = async (
  path,
  options = { method: 'get', headers: {}, data: null, signal: null }
) => {
  const response = await networking.networkApiCall(path, options);

  return new Proxy(response.data, handler);
};
