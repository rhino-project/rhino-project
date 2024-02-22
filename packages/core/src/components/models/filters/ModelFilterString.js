import PropTypes from 'prop-types';
import { useFormContext, useWatch } from 'react-hook-form';

import { useEffect } from 'react';
import { useModelFilterField } from 'rhino/hooks/form';
import FilterString from 'rhino/components/forms/filters/FilterString';
import { useModelFiltersContext } from 'rhino/hooks/controllers';

const ModelFilterString = ({ model, path, ...props }) => {
  const { attribute, operatorPath } = useModelFilterField(model, path);
  const { resetField } = useFormContext();

  const watch = useWatch({ name: operatorPath });

  const { setPill } = useModelFiltersContext();

  // If the user clears the input, we want to reset the pill
  useEffect(() => {
    if (watch !== undefined && watch !== '') setPill(operatorPath, watch);
  }, [operatorPath, resetField, setPill, watch]);

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
