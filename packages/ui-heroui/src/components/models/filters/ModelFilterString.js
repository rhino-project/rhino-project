import PropTypes from 'prop-types';
import { useWatch } from 'react-hook-form';

import { useEffect } from 'react';
import { useModelFilterField } from '../../../form';
import { useModelFiltersContext } from '@rhino-project/core/hooks';
import { FilterString } from '../../../Filter';

export const ModelFilterString = ({ path, ...props }) => {
  const { attribute, operatorPath, ...rest } = useModelFilterField(path);

  const watch = useWatch({ name: operatorPath });
  const { setPill } = useModelFiltersContext();

  // If the user clears the input, we want to reset the pill
  useEffect(() => {
    if (watch !== undefined && watch !== '') setPill(operatorPath, watch);
  }, [operatorPath, setPill, watch]);

  return (
    <FilterString
      path={operatorPath}
      minLength={attribute.minLength}
      maxLength={attribute.maxLength}
      {...rest}
      {...props}
    />
  );
};

ModelFilterString.propTypes = {
  operator: PropTypes.string,
  path: PropTypes.string.isRequired
};
