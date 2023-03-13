import PropTypes from 'prop-types';
import { useFormContext, useWatch } from 'react-hook-form';

import { useEffect } from 'react';
import { useModelFilterField, useFilterPill } from 'rhino/hooks/form';
import FilterString from 'rhino/components/forms/filters/FilterString';

const ModelFilterString = ({ model, path, ...props }) => {
  const { attribute, operatorPath } = useModelFilterField(model, path);
  const { resetField } = useFormContext();

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

  return (
    <FilterString
      path={operatorPath}
      minLength={attribute.minLength}
      maxLength={attribute.maxLength}
      {...props}
    />
  );
};

ModelFilterString.propTypes = {
  operator: PropTypes.string,
  path: PropTypes.string.isRequired
};

export default ModelFilterString;
