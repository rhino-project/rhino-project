import PropTypes from 'prop-types';
import { useWatch } from 'react-hook-form';

import { useEffect } from 'react';
import FilterSelectControlled from 'rhino/components/forms/filters/FilterSelectControlled';
import { useModelFilterField, useFilterPill } from 'rhino/hooks/form';

// FIXME: Nothing tests this yet
const ModelFilterIntegerSelect = ({ model, path, ...props }) => {
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
  const { setPill } = useFilterPill(operatorPath);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPill(watch), [watch]);

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

export default ModelFilterIntegerSelect;
