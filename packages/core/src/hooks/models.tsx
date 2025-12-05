import { isObject } from 'lodash-es';
import { useContext, useMemo } from 'react';
import { getModel, hasModule } from '../utils/models';
import { getModelAndAttributeFromPath } from '../utils/models.js';
import { ModelContext } from '../components/models/ModelProvider.js';
import { RhinoResourceSpecifier, RhinoResource } from '..';

/**
 * Memoize a model by name or with an existing model object
 *
 * @example
 *    const model = useModel('blog_post')
 *    const model = useModel(getModel('blog_post'))
 */
export const useModel = (model: RhinoResourceSpecifier): RhinoResource =>
  useMemo(() => (isObject(model) ? model : getModel(model)), [model]);

// Its currently ok to use this hook outside of a ModelProvider
// FIXME: Require a ModelProvider context
export const useModelContext = () => {
  const context = useContext(ModelContext) ?? {};

  return context;
};

/**
 * Return whether a module is enabled
 *
 * @example
 *    const enabled = useHasModule('rhino_organizations')
 */
export const useHasModule = (module: string): boolean =>
  useMemo(() => hasModule(module), [module]);

/**
 * Whether organizations module is enabled
 *
 * @example
 *    const enabled = useHasOrganizationsModule()
 */
export const useHasOrganizationsModule = () =>
  useHasModule('rhino_organizations');

/**
 * Whether notifications module is enabled
 *
 * @example
 *    const enabled = useHasNotificationsModule()
 */
export const useHasNotificationsModule = () =>
  useHasModule('rhino_notifications');

/**
 * Whether subscriptions module is enabled
 *
 * @example
 *    const enabled = useHasSubscriptionsModule()
 */
export const useHasSubscriptionsModule = () =>
  useHasModule('rhino_subscriptions');

export const useModelAndAttributeFromPath = (
  model: RhinoResourceSpecifier,
  path: string
) => {
  const memoModel = useModel(model);

  return useMemo(() => {
    const [model, attribute] = getModelAndAttributeFromPath(memoModel, path);

    return { model, attribute };
  }, [memoModel, path]);
};
