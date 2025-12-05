import PropTypes from 'prop-types';
import { useWatch } from 'react-hook-form';

import { useEffect } from 'react';
import { FilterSelectControlled } from '../../forms/filters/FilterSelectControlled';
import { useModelFilterField } from '@rhino-project/core/hooks';
import { useModelFiltersContext } from '@rhino-project/core/hooks';

export const ModelFilterIntegerSelect = ({ model, path, ...props }) => {
  const { attribute, operatorPath } = useModelFilterField(model, path);
  // FIXME: Exclusive min/max support
  const integers = Array.from(
    { length: attribute.maximum - attribute.minimum },
    (x, i) => ({
      id: i + attribute.minimum,
      display_name: `${i + attribute.minimum}`
    })
  );

  const watch = useWatch({ name: operatorPath });
  const { setPill } = useModelFiltersContext();

  useEffect(() => {
    if (watch) setPill(watch);
  }, [setPill, watch]);

  return (
    <FilterSelectControlled path={operatorPath} {...props}>
      {integers.map((integer) => (
        <option key={integer} value={integer}>
          {integer}
        </option>
      ))}
    </FilterSelectControlled>
  );
};

ModelFilterIntegerSelect.propTypes = {
  operator: PropTypes.string,
  path: PropTypes.string.isRequired
};
