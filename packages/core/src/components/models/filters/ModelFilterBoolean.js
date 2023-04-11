import PropTypes from 'prop-types';
import { useWatch } from 'react-hook-form';

import { useEffect } from 'react';
import { useModelFilterField, useFilterPill } from 'rhino/hooks/form';
import FilterBoolean from '../../forms/filters/FilterBoolean';

// FIXME: This is duplicated from FieldBooleanIndeterminate
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

const ModelFilterBoolean = ({ model, path, ...props }) => {
  const { attribute, operatorPath } = useModelFilterField(model, path);

  const watch = useWatch({ name: operatorPath });

  const { resetPill, setPill } = useFilterPill(operatorPath);

  useEffect(() => {
    // If its not true or false explicitly, reset the pill
    if (watch != null) {
      setPill(buildBooleanPill(attribute, watch));
    } else {
      resetPill();
    }
  }, [attribute, resetPill, setPill, watch]);

  return <FilterBoolean path={operatorPath} {...props} />;
};

ModelFilterBoolean.propTypes = {
  operator: PropTypes.string,
  path: PropTypes.string.isRequired
};

export default ModelFilterBoolean;
