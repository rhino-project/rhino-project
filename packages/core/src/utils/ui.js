import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { format, formatDistance } from 'date-fns';

import { getParentModel, isBaseOwned } from 'rhino/utils/models';
import { NavLink } from 'react-router-dom';
import { useBaseOwnerPath } from 'rhino/hooks/history';
import { Flag } from 'rhino/components/models/fields/ModelFieldCountry';
import { capitalize } from 'lodash';
import { getModelIndexPath, getModelShowPath } from './routes';
import { useModel } from 'rhino/hooks/models';

export const buildCancelAction = (extra) => ({
  name: 'cancel',
  label: 'Cancel',
  icon: 'x-square',
  outline: true,
  ...extra
});

export const buildSaveAction = (extra) => ({
  name: 'save',
  label: 'Save',
  color: 'primary',
  icon: 'save',
  ...extra
});

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

export const getStringForDisplay = (
  attribute,
  value,
  { dateFormat = getDateTimeLongString, empty = '-' } = {}
) => {
  let displayString;

  switch (attribute.type) {
    case 'array':
      switch (attribute.items?.type) {
        case 'string':
        case 'integer':
          displayString = value?.join(', ');
          break;
        default:
          if (
            attribute?.items?.anyOf?.[0]?.['$ref'] ===
            '#/components/schemas/active_storage_attachment'
          ) {
            displayString = `${value?.length} files`;
          } else {
            displayString = value?.map((v) => v.display_name).join(', ');
          }
      }
      break;
    case 'reference':
      if (attribute.name.endsWith('_attachment')) {
        if (!value) {
          displayString = empty;
        } else {
          if (attribute.format === 'image') {
            displayString = (
              <img
                src={value.url}
                alt={value.display_name}
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            );
          } else {
            displayString = (
              <a href={value.url} onClick={(e) => e.stopPropagation()}>
                {value.display_name}
              </a>
            );
          }
        }
      } else {
        displayString = value?.display_name;
      }
      break;
    case 'boolean':
      displayString = value ? 'Yes' : 'No';
      break;
    case 'string':
      switch (attribute.format) {
        case 'datetime':
        case 'date':
        case 'time':
          if (value) {
            displayString = dateFormat(attribute, value);
          }
          break;
        case 'country':
          if (value) {
            displayString = <Flag country={value} />;
          }
          break;
        default:
          displayString = value;
      }
      break;
    case 'decimal':
    case 'float':
    case 'number':
      if (attribute.format === 'currency') {
        const number = parseFloat(value);
        if (isNaN(number)) {
          displayString = null;
        } else if (number < 0) {
          displayString = `-$${(-1 * number).toFixed(2)}`;
        } else {
          displayString = `$${number.toFixed(2)}`;
        }
      } else {
        displayString = value;
      }
      break;
    default:
      displayString = value;
  }

  // Try to determine when the value is actually empty
  // Which does not include a number being 0 (int, float)
  return displayString === null ||
    displayString === undefined ||
    displayString === '' ||
    displayString?.length === 0
    ? empty
    : displayString;
};

export const BreadcrumbItemWrapper = ({ tag, to, children, ...props }) => {
  const baseOwnerPath = useBaseOwnerPath();
  const path = baseOwnerPath.build(to);

  return (
    <BreadcrumbItem tag={tag} to={path} {...props}>
      {children}
    </BreadcrumbItem>
  );
};

BreadcrumbItemWrapper.propTypes = {
  tag: PropTypes.elementType,
  to: PropTypes.string,
  children: PropTypes.node
};

export const breadcrumbChildrenFor = (model, resource, individual = false) => {
  let result = [];

  if (!resource) return result;

  if (isBaseOwned(model)) {
    const path = getModelIndexPath(model);
    result = [
      <BreadcrumbItemWrapper key={path} tag={NavLink} to={path} exact>
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
      <BreadcrumbItemWrapper key={path} tag={NavLink} to={path} exact>
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
      {capitalize(e)}
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

export const getOptionsList = (index) => {
  if (!index) return [];

  return index.results.map((result) => ({
    key: result.id,
    text: result.display_name,
    value: result.id
  }));
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
  const negativeChar = value.startsWith('-') ? '-' : '';
  const secondPart = (decimal || '')
    .replace(/[^0-9]/g, '')
    .substring(0, 2)
    .padEnd(2, '0');
  return `${negativeChar}${firstPart}.${secondPart}`;
};
