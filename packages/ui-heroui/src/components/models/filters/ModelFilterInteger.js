import PropTypes from 'prop-types';
import { useWatch } from 'react-hook-form';

import { useEffect, useMemo } from 'react';
import { useModelFilterField } from '../../../form';
import { useModelFiltersContext } from '@rhino-project/core/hooks';
import { FilterInteger } from '../../../Filter';

export const ModelFilterInteger = ({ path, ...props }) => {
  const { attribute, operatorPath, ...rest } = useModelFilterField(path);

  const min = useMemo(() => {
    if (attribute.exclusiveMinimum) return attribute.minimum + 1;

    return attribute.minimum;
  }, [attribute]);
  const max = useMemo(() => {
    if (attribute.exclusiveMaximum) return attribute.maximum - 1;

    return attribute.maximum;
  }, [attribute]);

  const watch = useWatch({ name: operatorPath });

  const { setPill } = useModelFiltersContext();

  useEffect(() => {
    if (watch !== undefined && watch !== '') setPill(operatorPath, watch);
  }, [operatorPath, setPill, watch]);

  return (
    <FilterInteger
      path={operatorPath}
      min={min}
      max={max}
      {...rest}
      {...props}
    />
  );
};

ModelFilterInteger.propTypes = {
  operator: PropTypes.string,
  path: PropTypes.string.isRequired
};
