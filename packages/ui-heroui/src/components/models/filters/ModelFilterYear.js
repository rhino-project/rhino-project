import PropTypes from 'prop-types';
import { useWatch } from 'react-hook-form';

import { useEffect, useMemo } from 'react';
import { useModelFilterField } from '../../../form';
import { useModelFiltersContext } from '@rhino-project/core/hooks';
import { FilterYear } from '../../../Filter';

export const ModelFilterYear = ({ model, path, ...props }) => {
  const { attribute, operatorPath, ...rest } = useModelFilterField(model, path);
  const min = useMemo(() => {
    if (!attribute.minimum) return undefined;

    return attribute.exclusiveMinimum
      ? attribute.minimum + 1
      : attribute.minimum;
  }, [attribute]);

  const max = useMemo(() => {
    if (!attribute.maximum) return undefined;

    return attribute.exclusiveMaximum
      ? attribute.maximum - 1
      : attribute.maximum;
  }, [attribute]);

  const watch = useWatch({ name: operatorPath });
  const { setPill } = useModelFiltersContext();

  useEffect(() => {
    if (watch !== undefined && watch !== '') setPill(operatorPath, watch);
  }, [attribute, operatorPath, setPill, watch]);

  return (
    <FilterYear path={operatorPath} min={min} max={max} {...rest} {...props} />
  );
};

ModelFilterYear.propTypes = {
  operator: PropTypes.string,
  path: PropTypes.string.isRequired
};
