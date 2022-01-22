import { isObject } from 'lodash';
import { useMemo } from 'react';
import { getModel } from 'rhino/utils/models';

export const useModel = (model) =>
  useMemo(() => (isObject(model) ? model : getModel(model)), [model]);
