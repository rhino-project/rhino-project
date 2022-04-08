import { isObject } from 'lodash';
import { useMemo } from 'react';
import { getModel } from 'rhino/utils/models';

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
