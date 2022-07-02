import { isObject } from 'lodash';
import { useMemo } from 'react';
import { getModel, hasModule } from 'rhino/utils/models';

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
