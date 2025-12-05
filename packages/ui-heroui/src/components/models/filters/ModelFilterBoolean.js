import PropTypes from 'prop-types';
import { useWatch } from 'react-hook-form';

import { useEffect } from 'react';
import { useModelFilterField } from '../../../form';
import { useModelFiltersContext } from '@rhino-project/core/hooks';
import { FilterBoolean } from '../../../Filter';

// Ensure that if the value is a string coming from the url, it is either 'true' or 'false'
const parseBooleanFilterValue = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return null;

  const normalized = value.trim().replace(/ /g, '').toLowerCase();
  if (normalized === 'true') return true;
  if (normalized === 'false') return false;
  return null;
};

const buildBooleanPill = (attribute, value) => {
  const parsedValue = parseBooleanFilterValue(value);

  if (parsedValue == null) return null;

  const state = parsedValue === false ? 'Not ' : '';

  return `${state}${attribute.readableName}`;
};

export const ModelFilterBoolean = ({ path, ...props }) => {
  const { attribute, operatorPath, label, ...rest } = useModelFilterField(path);
  const watch = useWatch({ name: operatorPath });

  const { setPill } = useModelFiltersContext();

  useEffect(() => {
    if (watch != null)
      setPill(operatorPath, buildBooleanPill(attribute, watch));
  }, [attribute, operatorPath, setPill, watch]);

  return (
    <FilterBoolean path={operatorPath} {...rest} {...props}>
      {label}
    </FilterBoolean>
  );
};

ModelFilterBoolean.propTypes = {
  operator: PropTypes.string,
  path: PropTypes.string.isRequired
};
