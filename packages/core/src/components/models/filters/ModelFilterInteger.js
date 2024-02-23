import PropTypes from 'prop-types';
import { useFormContext, useWatch } from 'react-hook-form';

import { useEffect, useMemo } from 'react';
import { useModelFilterField } from '../../../hooks/form';
import FilterInteger from '../../forms/filters/FilterInteger';
import { useModelFiltersContext } from '../../../hooks/controllers';

const ModelFilterInteger = ({ model, path, ...props }) => {
  const { attribute, operatorPath } = useModelFilterField(model, path);
  const { resetField } = useFormContext();

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
  }, [operatorPath, resetField, setPill, watch]);

  return <FilterInteger path={operatorPath} min={min} max={max} {...props} />;
};

ModelFilterInteger.propTypes = {
  operator: PropTypes.string,
  path: PropTypes.string.isRequired
};

export default ModelFilterInteger;
