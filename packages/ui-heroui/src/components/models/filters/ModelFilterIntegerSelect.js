import PropTypes from 'prop-types';
import { useWatch } from 'react-hook-form';

import { useEffect } from 'react';
import { useModelFilterField } from '../../../form';
import { useModelFiltersContext } from '@rhino-project/core/hooks';
import { FieldSelect } from '../../../FieldSelect';
import { SelectItem } from '@heroui/react';

export const ModelFilterIntegerSelect = ({ path, ...props }) => {
  const { attribute, operatorPath, ...rest } = useModelFilterField(path); // FIXME: Exclusive min/max support
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
    <FieldSelect path={operatorPath} items={integers} {...rest} {...props}>
      {/* FIXME Should be a function with items */}
      {integers?.map((integer) => (
        <SelectItem key={integer} textValue={`${integer}`}>
          {integer}
        </SelectItem>
      ))}
    </FieldSelect>
  );
};

ModelFilterIntegerSelect.propTypes = {
  operator: PropTypes.string,
  path: PropTypes.string.isRequired
};
