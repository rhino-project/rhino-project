import { filter, find, toPath, set } from 'lodash';
import modelLoader from 'rhino/models';

/**
 * @typedef {object} Model
 * @property {string} model
 * @property {string} name
 */

export const getModel = (model) => modelLoader.api.components.schemas[model];
export const getParentModel = (model) => getModel(model.ownedBy);
export const getModelAncestors = (model) => {
  const result = [];
  model = getParentModel(model);
  while (model != null) {
    result.push(model);
    model = getParentModel(model);
  }
  return result;
};
export const getBaseOwnerFilters = (model, baseOwnerId) => {
  const filters = {};
  const pathToRoot = getModelAncestors(model);
  const rootModel = pathToRoot[pathToRoot.length - 1];
  // if the root model is globally owned, we don't want to add any filters. these models have 'global' as parent.
  // only the base owner will have null as parent.
  if (baseOwnerId && rootModel && rootModel.ownedBy == null) {
    const modelNames = pathToRoot.map((el) => el.model);
    set(filters, ['filter', ...modelNames], baseOwnerId);
  }
  return filters;
};

export const getCreatableAttributes = (model) =>
  filter(model.properties, (a) => a.creatable);
export const getUpdatableAttributes = (model) =>
  filter(model.properties, (a) => a.updatable);

export const isReference = (attribute) => attribute.type === 'reference';
export const getReferenceAttributes = (model) =>
  filter(model.properties, (a) => isReference(a));

export const isIdentifier = (attribute) => attribute.type === 'identifier';
export const getIdentifierAttribute = (model) =>
  find(model.properties, (a) => isIdentifier(a));

export const getModuleInfo = (module) =>
  modelLoader.api.info['x-rhino']?.modules?.[module];

export const authOwnerProperty = () => getModuleInfo('rhino')?.authOwner;
export const authOwnerModel = () => getModel(authOwnerProperty());

export const baseOwnerProperty = () => getModuleInfo('rhino')?.baseOwner;
export const baseOwnerModel = () => getModel(baseOwnerProperty());
export const isBaseOwned = (model) => model.ownedBy === baseOwnerProperty();
export const getBaseOwnedModels = () =>
  filter(modelLoader.api.components.schemas, isBaseOwned);

export const getOwnedModels = (model) =>
  filter(modelLoader.api.components.schemas, (m) => m.ownedBy === model.model);

export const getModelFromRef = (attribute) => {
  const ref =
    // Direct ref
    attribute['$ref'] ||
    // anyOf ref, probably because its nullable
    attribute?.anyOf?.[0]?.['$ref'] ||
    // Any array of refs
    attribute?.items?.['$ref'] ||
    // Any array of anyOf refs
    attribute?.items?.anyOf?.[0]?.['$ref'];

  if (!ref) return null;

  const parts = ref.split('/');
  const refName = parts[parts.length - 1];

  const model = modelLoader.api.components.schemas[refName];

  console.assert(
    model,
    `Reference for attribute ${attribute.name} was not found`,
    attribute
  );

  return model;
};

export const getModelAndAttributeFromPath = (model, path) => {
  const split = toPath(path);
  const length = split.length;
  let last_model = model;
  let index = 0;
  let attribute = null;
  let operator = null;
  let plainPath = [];

  while (model && index < length) {
    const [attributeName, operatorName] = split[index++].split('::');

    // A number means its an array indicator
    if (!isNaN(parseInt(attributeName))) {
      continue;
    }
    plainPath.push(attributeName);

    // FIXME Gross hack
    if (attributeName === 'display_name') {
      return [
        last_model,
        {
          model: model.model,
          name: model.model,
          // The last attribute in the path should be the parent model
          readableName: attribute?.readableName || 'Name',
          type: 'string'
        }
      ];
    } else {
      attribute = model.properties[attributeName];
      operator = operatorName;
    }

    last_model = model;
    model = getModelFromRef(attribute);
  }

  return index && index === length
    ? [last_model, attribute, operator, plainPath.join('.')]
    : [undefined, undefined];
};

export const getAttributeFromPath = (model, path) =>
  getModelAndAttributeFromPath(model, path)[1];

export const oauthProviders = () => getModuleInfo('rhino')?.oauth || [];

export const hasModule = (moduleName) =>
  getModuleInfo(moduleName) !== undefined;

export const hasOrganizationsModule = () => hasModule('rhino_organizations');
export const hasNotificationsModule = () => hasModule('rhino_notifications');
export const hasSubscriptionsModule = () => hasModule('rhino_subscriptions');
