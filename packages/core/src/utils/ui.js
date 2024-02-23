import { format, formatDistance } from 'date-fns';
import { useMemo } from 'react';
import { Breadcrumb } from 'reactstrap';

import { NavLink } from 'react-router-dom';
import { useModel } from '../hooks/models';
import { getParentModel, isBaseOwned } from './models';
import { BreadcrumbItemWrapper } from '../components/breadcrumbs';
import { getModelIndexPath, getModelShowPath } from './routes';

export const useModelClassNames = (baseName, model, attribute = null) => {
  // FIXME: This is a hack for 2.0 legacy support - should be sourced from the model context
  const memoModel = useModel(model);

  return useMemo(() => {
    const cn = `model-${baseName} model-${baseName}-${memoModel.model}`;

    if (!attribute) return cn;

    return cn.concat(` model-${baseName}-${memoModel.model}-${attribute.name}`);
  }, [baseName, memoModel, attribute]);
};

export const getDateTimeFormat = (attribute) => {
  const dateTimeFormat = {
    datetime: 'MMMM d, yyyy h:mm aa',
    date: 'MMMM d, yyyy',
    time: 'h:mm aa',
    year: 'yyyy'
  };

  return dateTimeFormat[attribute.format];
};

//FIXME update ModelFormFieldDatetime to use this function for datetime format
const getDateTimeDisplayString = (dateTime, type) =>
  dateTime && type === 'date'
    ? new Date(dateTime.replace(/-/g, `/`).replace(/T.+/, ''))
    : dateTime && type !== 'date'
      ? new Date(dateTime)
      : '';

export const getDateTimeLongString = (attribute, value) =>
  format(
    getDateTimeDisplayString(value, attribute.format),
    getDateTimeFormat(attribute)
  );

export const getDateTimeDistanceString = (attribute, value) =>
  formatDistance(new Date(value), new Date(), { addSuffix: true });

export const breadcrumbChildrenFor = (model, resource, individual = false) => {
  let result = [];

  if (!resource) return result;

  if (isBaseOwned(model)) {
    const path = getModelIndexPath(model);
    result = [
      <BreadcrumbItemWrapper key={path} tag={NavLink} to={path} end>
        {model.pluralReadableName}
      </BreadcrumbItemWrapper>
    ];
  } else {
    const parentModel = getParentModel(model);
    const parent = resource[parentModel?.model];
    result = [breadcrumbChildrenFor(parentModel, parent, true)];
  }

  if (individual) {
    const path = getModelShowPath(model, resource.id);
    result.push(
      <BreadcrumbItemWrapper key={path} tag={NavLink} to={path} end>
        {resource['display_name']}
      </BreadcrumbItemWrapper>
    );
  }

  return result;
};

export const breadcrumbFor = (model, resource, individual = false) => {
  return (
    <Breadcrumb>
      {breadcrumbChildrenFor(model, resource, individual)}
    </Breadcrumb>
  );
};

export const optionsFromIndex = (
  results,
  labelField = 'display_name',
  valueField = 'id'
) => {
  if (!results) return [];

  return results.map((r) => (
    <option key={r.id} value={`${r[valueField]}`}>
      {r[labelField]}
    </option>
  ));
};

export const optionsFromIndexWithTitle = (
  results,
  title,
  labelField,
  valueField
) => {
  const options = optionsFromIndex(results, labelField, valueField);

  options.push(
    <option key="-1" disabled value={-1}>
      {title}
    </option>
  );

  return options;
};

export const enumFromIndexWithTitle = (enums = [], title) => {
  const options = enums.map((e) => (
    <option key={e} value={e}>
      {e}
    </option>
  ));

  options.push(
    <option key="-1" disabled value={-1}>
      {title}
    </option>
  );

  return options;
};

export const optionsFromNumberRange = (first, last) => {
  return Array.from({ length: last - first + 1 }, (x, i) => (
    <option key={first + i} value={first + i}>
      {first + i}
    </option>
  ));
};

export const optionsFromNumberRangeWithTitle = (first, last, title) => {
  const options = optionsFromNumberRange(first, last);

  options.push(
    <option key="-1" disabled selected value={-1}>
      {title}
    </option>
  );

  return options;
};

export const applyCurrencyMaskFromInput = ({
  target: { value, selectionEnd, selectionStart }
}) => {
  if (value === '' || value === '.00') {
    return { value: '', selectionStart: 0, selectionEnd: 0 };
  }

  let newNumber;
  let selectionStartIndex = selectionEnd;
  let selectionEndIndex = selectionStart;

  const hasDot = value.includes('.');
  const negativeChar = value.startsWith('-') ? '-' : '';
  const digits = value.replace(/\D/g, '');

  if (Number(digits) === 0 && digits.length <= 2 && hasDot) {
    const zero = digits === '00' ? '0' : digits;
    return {
      value: `${negativeChar}${zero}`,
      selectionStart: zero.length,
      selectionEnd: zero.length
    };
  }

  if (hasDot) {
    const [int, decimal] = value.split('.');
    const firstPart = int.replace(/[^0-9]/g, '');
    const secondPart = decimal
      .replace(/[^0-9]/g, '')
      .substring(0, 2)
      .padEnd(2, '0');
    newNumber = `${negativeChar}${firstPart}.${secondPart}`;

    if (int === '') {
      selectionStartIndex = newNumber.length - 3;
      selectionEndIndex = selectionStartIndex;
    }
  } else {
    if (selectionEndIndex === value.length - 2) {
      const decimals = value.substring(value.length - 2, value.length);
      const int = value.substring(0, value.length - 2);
      newNumber = `${int}.${decimals}`;
    } else {
      newNumber = `${negativeChar}${value
        .replace(/[^0-9]/g, '')
        .padStart(1, '0')}.00`;
    }
  }

  return {
    value: newNumber,
    selectionStart: selectionStartIndex,
    selectionEnd: selectionEndIndex
  };
};

export const applyCurrencyMask = (value) => {
  if (!value && value !== 0) return value;

  const [int, decimal] = String(value).split('.');
  const firstPart = int.replace(/[^0-9]/g, '').padEnd(1, '0');
  const negativeChar = String(value).startsWith('-') ? '-' : '';
  const secondPart = (decimal || '')
    .replace(/[^0-9]/g, '')
    .substring(0, 2)
    .padEnd(2, '0');
  return `${negativeChar}${firstPart}.${secondPart}`;
};
