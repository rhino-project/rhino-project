import PropTypes from 'prop-types';
import { useFormContext, useWatch } from 'react-hook-form';

import { useEffect, useMemo } from 'react';
import { useModelFilterField } from 'rhino/hooks/form';
import FilterFloat from 'rhino/components/forms/filters/FilterFloat';
import { useModelFiltersContext } from 'rhino/hooks/controllers';

const FLOAT_INCREMENT = 0.000000000000001;

const ModelFilterFloat = ({ model, path, ...props }) => {
  const { attribute, operatorPath } = useModelFilterField(model, path);
  const { resetField } = useFormContext();

  const min = useMemo(() => {
    if (attribute.exclusiveMinimum) return attribute.minimum + FLOAT_INCREMENT;

    return attribute.minimum;
  }, [attribute]);
  const max = useMemo(() => {
    if (attribute.exclusiveMaximum) return attribute.maximum - FLOAT_INCREMENT;

    return attribute.maximum;
  }, [attribute]);

  const watch = useWatch({ name: operatorPath });

  const { setPill } = useModelFiltersContext();

  // If the user clears the input, we want to reset the pill
  useEffect(() => {
    if (watch !== undefined && watch !== '') setPill(operatorPath, watch);
  }, [operatorPath, resetField, setPill, watch]);

  return <FilterFloat path={operatorPath} min={min} max={max} {...props} />;
};

ModelFilterFloat.propTypes = {
  operator: PropTypes.string,
  path: PropTypes.string.isRequired
};

export default ModelFilterFloat;
