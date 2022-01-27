import { Route } from 'react-router-dom';
import { each, map } from 'lodash';

import modelLoader from 'rhino/models';

import ModelIndex from 'rhino/pages/model/Index';
import ShowModel from 'rhino/pages/model/Show';
import CreateModel from 'rhino/pages/model/Create';
import EditModel from 'rhino/pages/model/Edit';

const generateModelRoutePaths = () => {
  let routes = {};

  each(modelLoader.api.components.schemas, (m) => {
    routes[m.name] = {
      show: (id) => `/${m.pluralName}/${id}`,
      index: () => `/${m.pluralName}`,
      create: () => `/${m.pluralName}/new`,
      edit: (id) => `/${m.pluralName}/${id}/edit`
    };
  });

  return routes;
};

const modelRoutePaths = {
  ...generateModelRoutePaths()
};

export const modelRoute = (model, match, action, Component, params) => (
  <Route
    key={`${model.name}-${action}`}
    exact
    path={`${match.path}${modelRoutePaths[model.name][action](params)}`}
    render={() => <Component model={model} />}
  />
);

export const modelCreateRoute = (model, match) =>
  modelRoute(model, match, 'create', CreateModel);
export const modelShowRoute = (model, match) =>
  modelRoute(model, match, 'show', ShowModel, ':id');
export const modelIndexRoute = (model, match) =>
  modelRoute(model, match, 'index', ModelIndex);
export const modelEditRoute = (model, match) =>
  modelRoute(model, match, 'edit', EditModel, ':id');

export const modelCrudRoutes = (model, match) => {
  return [
    modelCreateRoute(model, match),
    modelShowRoute(model, match),
    modelIndexRoute(model, match),
    modelEditRoute(model, match)
  ];
};

export const modelRoutes = (match) =>
  map(modelLoader.api.components.schemas, (m) => modelCrudRoutes(m, match));
export default modelRoutePaths;
