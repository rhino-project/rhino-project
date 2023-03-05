import PropTypes from 'prop-types';
import { useFormContext, useWatch } from 'react-hook-form';

import { useEffect, useMemo } from 'react';
import { useModelFilterField, useFilterPill } from 'rhino/hooks/form';
import FilterInteger from '../../forms/filters/FilterInteger';

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

  const watch = useWatch({ name: operatorPath, defaultValue: '' });

  const { resetPill, setPill } = useFilterPill(operatorPath);

  // If the user clears the input, we want to reset the pill
  useEffect(() => {
    if (watch !== undefined && watch !== '') {
      setPill(watch);
    } else {
      resetPill();
      // FIXME: This is a hack to reset the field when clear all filters is clicked
      resetField(operatorPath);
    }
  }, [operatorPath, resetField, resetPill, setPill, watch]);

  return <FilterInteger path={operatorPath} min={min} max={max} {...props} />;
};

ModelFilterInteger.propTypes = {
  operator: PropTypes.string,
  path: PropTypes.string.isRequired
};

export default ModelFilterInteger;
