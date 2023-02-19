import { useModelFilterField } from 'rhino/hooks/form';
import { useGlobalOverrides } from 'rhino/hooks/overrides';
import FilterLabel from '../forms/FilterLabel';

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

const defaultComponents = {
  ModelFilterLabel: FilterLabel
};

export const ModelFilterLabel = ({ overrides, ...props }) => {
  // FIXME: Is re-using the name for overrides good idea?
  const { ModelFilterLabel } = useGlobalOverrides(defaultComponents, overrides);

  const { model, path } = props;
  const { attribute, operator } = useModelFilterField(model, path);

  const label = `${attribute.readableName} ${operatorToLabel(
    attribute.format,
    operator
  )}`;

  return <ModelFilterLabel label={label} />;
};

export default ModelFilterLabel;
