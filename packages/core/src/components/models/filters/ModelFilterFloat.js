import PropTypes from 'prop-types';
import { useFormContext, useWatch } from 'react-hook-form';

import { useEffect, useMemo } from 'react';
import { useModelFilterField, useFilterPill } from 'rhino/hooks/form';
import FilterFloat from 'rhino/components/forms/filters/FilterFloat';

const ModelFilterFloat = ({ model, path, ...props }) => {
  const { attribute, operatorPath } = useModelFilterField(model, path);
  const { resetField } = useFormContext();

  // FIXME: Exclusive min/max support
  const min = useMemo(() => attribute.minimum, [attribute]);
  const max = useMemo(() => attribute.maximum, [attribute]);

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

  return <FilterFloat path={operatorPath} min={min} max={max} {...props} />;
};

ModelFilterFloat.propTypes = {
  operator: PropTypes.string,
  path: PropTypes.string.isRequired
};

export default ModelFilterFloat;
