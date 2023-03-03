import PropTypes from 'prop-types';
import { useFormContext, useWatch } from 'react-hook-form';

import { useCallback, useEffect, useMemo } from 'react';
import { useModelFilterField, useFilterPill } from 'rhino/hooks/form';
import FilterInteger from '../../forms/filters/FilterInteger';

const ModelFilterInteger = (props) => {
  const { model, path } = props;
  const { attribute, operatorPath } = useModelFilterField(model, path);
  const { resetField } = useFormContext();

  // FIXME: Exclusive min/max support
  const min = useMemo(() => attribute.minimum, [attribute]);
  const max = useMemo(() => attribute.maximum, [attribute]);

  // We want it to be blank if it's not a number
  const setValueAs = useCallback((value) => {
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) return undefined;

    return parsed;
  }, []);

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

  // FIXME: Add support for inheriting props - currently can't do this because of path vs operatorPath
  return (
    <FilterInteger
      path={operatorPath}
      min={min}
      max={max}
      setValueAs={setValueAs}
    />
  );
};

ModelFilterInteger.propTypes = {
  operator: PropTypes.string,
  path: PropTypes.string.isRequired
};

export default ModelFilterInteger;
