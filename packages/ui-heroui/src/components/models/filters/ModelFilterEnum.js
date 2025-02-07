import PropTypes from 'prop-types';
import { useWatch } from 'react-hook-form';

import { useEffect, useMemo } from 'react';
import { useModelFiltersContext } from '@rhino-project/core/hooks';
import { FieldSelect } from '../../../FieldSelect';
import { SelectItem } from '@heroui/react';
import { useModelFilterField } from '../../../form';

export const ModelFilterEnum = ({ model, path, ...props }) => {
  const { attribute, operatorPath, ...rest } = useModelFilterField(model, path);

  const options = useMemo(
    () =>
      attribute?.enum?.map((value) => (
        <SelectItem key={value} className="capitalize" textValue={value}>
          {value}
        </SelectItem>
      )) || [],
    [attribute]
  );

  const watch = useWatch({ name: operatorPath });

  const { setPill } = useModelFiltersContext();

  useEffect(() => {
    if (watch !== undefined && watch !== '') setPill(operatorPath, watch);
  }, [operatorPath, setPill, watch]);

  return (
    <FieldSelect path={operatorPath} {...rest} {...props}>
      {options}
    </FieldSelect>
  );
};

ModelFilterEnum.propTypes = {
  operator: PropTypes.string,
  path: PropTypes.string.isRequired
};
