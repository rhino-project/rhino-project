import { useMemo } from 'react';
import { useGlobalComponentForModel } from '../../hooks/overrides';
import { useModelFilterField } from '../../hooks/form';
import { FilterLabel } from '../forms/FilterLabel';

const isDateRelated = (format) => ['date', 'time', 'datetime'].includes(format);

const operatorToDateLabel = (operator) => {
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
};

const operatorToLabel = (format, operator) => {
  if (isDateRelated(format)) return operatorToDateLabel(operator);

  switch (operator) {
    case 'diff':
    case 'gt':
      return '>';
    case 'gteq':
      return '>=';
    case 'lt':
      return '<';
    case 'lteq':
      return '<=';
    default:
      return '';
  }
};

export const ModelFilterLabelBase = ({ label, model, ...props }) => {
  const { path } = props;
  const { attribute, operator } = useModelFilterField(model, path);
  const modelLabel = useMemo(
    () =>
      label ||
      `${attribute.readableName} ${operatorToLabel(
        attribute.format,
        operator
      )}`,
    [attribute, operator, label]
  );

  return <FilterLabel label={modelLabel} {...props} />;
};

export const ModelFilterLabel = (props) =>
  useGlobalComponentForModel('ModelFilterLabel', ModelFilterLabelBase, props);
