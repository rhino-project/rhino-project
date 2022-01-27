import axios from 'axios';
import qs from 'qs';

import env from 'config';
import { toastStore } from 'rhino/queries/toast';

const REACT_APP_API_ROOT_PATH = env.REACT_APP_API_ROOT_PATH;
export const AUTH_BASE_PATH = 'api/auth';
export const AUTH_ACCEPT_PATH = `${AUTH_BASE_PATH}/invitation`;
export const AUTH_CREATE_END_POINT = AUTH_BASE_PATH + '/sign_in';
export const AUTH_DESTROY_END_POINT = AUTH_BASE_PATH + '/sign_out';
export const AUTH_PASSWORD_END_POINT = AUTH_BASE_PATH + '/password';
export const AUTH_VALIDATE_TOKEN_END_POINT = AUTH_BASE_PATH + '/validate_token';
export const AUTH_SESSION_KEY = 'session';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
};

const constructPath = (path) => REACT_APP_API_ROOT_PATH + '/' + path;

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

export const networkApiCall = (
  path,
  options = { method: 'get', headers: {}, data: null }
) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios(constructPath(path), {
    ...options,
    headers: _buildHeaders(options.headers),
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: 'brackets' }),
    cancelToken: source.token,
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

  // https://react-query.tanstack.com/guides/query-cancellation#using-axios
  promise.cancel = () => source.cancel('Query was cancelled by React Query');

  return promise;
};
