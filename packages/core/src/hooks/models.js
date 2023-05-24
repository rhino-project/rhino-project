import { isObject } from 'lodash';
import { useContext, useMemo } from 'react';
import { getModel, hasModule } from 'rhino/utils/models';
import { getModelAndAttributeFromPath } from '../utils/models.js';
import { ModelContext } from 'rhino/components/models/ModelProvider.js';

/**
 * @typedef {import('../utils/models.js').Model} Model
 */

/**
 * Memoize a model by name or with an existing model object
 *
 * @param {string | Model} model - The model name or model to memoize
 * @returns {Model} Memoized model object
 *
 * @example
 *    const model = useModel('blog_post')
 *    const model = useModel(getModel('blog_post'))
 */
export const useModel = (model) =>
  useMemo(() => (isObject(model) ? model : getModel(model)), [model]);

// Its currently ok to use this hook outside of a ModelProvider
// FIXME: Require a ModelProvider context
export const useModelContext = () => {
  const context = useContext(ModelContext) ?? {};

  return context;
};

export const useModelController = (options) => {
  const model = useModel(options.model);

  return { model };
};

/**
 * Return whether a module is enabled
 *
 * @param {string} module - The module nmae
 * @returns {Boolean} Whether the module exists
 *
 * @example
 *    const enabled = useHasModule('rhino_organizations')
 */
export const useHasModule = (module) =>
  useMemo(() => hasModule(module), [module]);

/**
 * Whether organizations module is enabled
 *
 * @returns {Boolean} If organizations module exists
 *
 * @example
 *    const enabled = useHasOrganizationsModule()
 */
export const useHasOrganizationsModule = () =>
  useHasModule('rhino_organizations');

/**
 * Whether notifications module is enabled
 *
 * @returns {Boolean} If notifications module exists
 *
 * @example
 *    const enabled = useHasNotificationsModule()
 */
export const useHasNotificationsModule = () =>
  useHasModule('rhino_notifications');

/**
 * Whether subscriptions module is enabled
 *
 * @returns {Boolean} If subscriptions module exists
 *
 * @example
 *    const enabled = useHasSubscriptionsModule()
 */
export const useHasSubscriptionsModule = () =>
  useHasModule('rhino_subscriptions');

export const useModelAndAttributeFromPath = (model, path) => {
  const memoModel = useModel(model);

  return useMemo(() => {
    const [model, attribute] = getModelAndAttributeFromPath(memoModel, path);

    return { model, attribute };
  }, [memoModel, path]);
};
