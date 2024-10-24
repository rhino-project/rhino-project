import { each, map } from 'lodash-es';
import { Route } from 'react-router-dom';

import modelLoader from '../models';

import { Create as CreateModel } from '../pages/model/Create';
import { Edit as EditModel } from '../pages/model/Edit';
import { Index as ModelIndex } from '../pages/model/Index';
import { Show as ShowModel } from '../pages/model/Show';

const generateModelRoutePaths = () => {
  const routes = {};

  each(modelLoader.api.components.schemas, (m) => {
    routes[m.name] = {
      show: (id) => `${m.pluralName}/${id}`,
      index: () => `${m.pluralName}`,
      create: () => `${m.pluralName}/new`,
      edit: (id) => `${m.pluralName}/${id}/edit`
    };
  });

  return routes;
};

export const modelRoutePaths = {
  ...generateModelRoutePaths()
};

export const modelRoute = (model, action, Component, params) => (
  <Route
    key={`${model.name}-${action}`}
    render={() => <Component model={model} />}
    path={`${modelRoutePaths[model.name][action](params)}`}
    element={<Component model={model} />}
  >
    <Component model={model} />
  </Route>
);

export const modelCreateRoute = (model) =>
  modelRoute(model, 'create', CreateModel);
export const modelShowRoute = (model) =>
  modelRoute(model, 'show', ShowModel, ':id');
export const modelIndexRoute = (model) =>
  modelRoute(model, 'index', ModelIndex);
export const modelEditRoute = (model) =>
  modelRoute(model, 'edit', EditModel, ':id');

export const modelCrudRoutes = (model) => {
  /*
   * TODO:
   * We should never have to write out these route keys manually.
   * Instead, we should be able to generate them from the model.
   * There should be helper functions that generate the route keys
   * based on the model name and action.
   */
  return (
    <Route key={`${model.pluralName}`} path={`${model.pluralName}`}>
      <Route key={`${model.pluralName}-collection`}>
        <Route
          key={`${model.name}-collection-index`}
          index
          element={
            <ModelIndex key={`${model.name}-collection-index`} model={model} />
          }
        />
        <Route
          key={`${model.name}-collection-create`}
          path="new"
          element={
            <CreateModel
              key={`${model.name}-collection-create`}
              model={model}
            />
          }
        />
      </Route>
      <Route key={`${model.pluralName}-member`} path=":id">
        <Route
          key={`${model.name}-member-show`}
          index
          element={
            <ShowModel key={`${model.name}-member-show`} model={model} />
          }
        />
        <Route
          key={`${model.name}-member-show`}
          path="edit"
          element={
            <EditModel key={`${model.name}-member-show`} model={model} />
          }
        />
      </Route>
    </Route>
  );
};

export const modelRoutes = ({ except = [], only = [] } = {}) => {
  if (only.length) {
    return map(
      modelLoader.api.components.schemas,
      (m) =>
        only.includes(m.name) && !except.includes(m.name) && modelCrudRoutes(m)
    ).filter(Boolean);
  }

  return map(
    modelLoader.api.components.schemas,
    (m) => !except.includes(m.name) && modelCrudRoutes(m)
  ).filter(Boolean);
};
