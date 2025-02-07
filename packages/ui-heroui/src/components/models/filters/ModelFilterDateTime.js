import PropTypes from 'prop-types';
import { useWatch } from 'react-hook-form';
import { format, parseISO } from 'date-fns';

import { useEffect, useMemo } from 'react';
import { useModelFilterField } from '../../../form';
import { getDateTimeFormat } from '../../../utils/ui';
import { useModelFiltersContext } from '@rhino-project/core/hooks';
import { FilterDateTime } from '../../../Filter';
import { parseAbsoluteToLocal } from '@internationalized/date';

// FIXME: Replicated in ModelFilterDate, ModelFilterDateTime, ModelFilterTime
const operatorToLabel = (format, operator) => {
  if (['date', 'time', 'datetime'].includes(format)) {
    switch (operator) {
      case 'diff':
        return 'not';
      case 'gt':
      case 'gteq':
        return 'after';
      case 'lt':
      case 'lteq':
        return 'before';
      default:
        return '';
    }
  } else {
    return '';
  }
};

const buildDateTimePill = (attribute, operator, newValue) => {
  if (!newValue) return null;
  const date = typeof newValue === 'string' ? parseISO(newValue) : newValue;
  return `${attribute.readableName} ${operatorToLabel(
    attribute.format,
    operator
  )} ${format(date, getDateTimeFormat(attribute))}`;
};

export const ModelFilterDateTime = ({ model, path, ...props }) => {
  const { attribute, operator, operatorPath, ...rest } = useModelFilterField(
    model,
    path
  );

  const minValue = useMemo(() => {
    if (!attribute.minimum) return undefined;

    const date = parseAbsoluteToLocal(attribute.minimum);

    // If the minimum is exclusive, we need to add a second to it so the value is not included
    if (attribute.exclusiveMinimum) return date.add({ seconds: 1 });

    return date;
  }, [attribute]);

  const maxValue = useMemo(() => {
    if (!attribute.maximum) return undefined;

    const date = parseAbsoluteToLocal(attribute.maximum);

    // If the maximum is exclusive, we need to subtract a second to it so the value is not included
    if (attribute.exclusiveMaximum) return date.subtract({ seconds: 1 });

    return date;
  }, [attribute]);

  const watch = useWatch({ name: operatorPath });

  const { setPill } = useModelFiltersContext();

  useEffect(() => {
    if (watch !== undefined && watch !== '')
      setPill(operatorPath, buildDateTimePill(attribute, operator, watch));
  }, [attribute, operator, operatorPath, setPill, watch]);

  return (
    <FilterDateTime
      path={operatorPath}
      minValue={minValue}
      maxValue={maxValue}
      {...rest}
      {...props}
    />
  );
};

ModelFilterDateTime.propTypes = {
  operator: PropTypes.string,
  path: PropTypes.string.isRequired
};
