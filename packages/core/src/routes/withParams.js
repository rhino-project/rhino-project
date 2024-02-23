import qs from 'qs';

export const withParams = (route, params) => {
  if (Object.keys(params).length > 0) {
    return `${route}?${qs.stringify(params)}`;
  } else {
    return route;
  }
};
