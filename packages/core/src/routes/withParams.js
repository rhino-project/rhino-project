import qs from 'qs';

const withParams = (route, params) => {
  if (Object.keys(params).length > 0) {
    return `${route}?${qs.stringify(params)}`;
  } else {
    return route;
  }
};

export default withParams;
