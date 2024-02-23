import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import {
  FieldGroupCurrency,
  FieldGroupFloatingCurrency,
  FieldGroupHorizontalCurrency,
} from '../../forms/fieldGroups/FieldGroupCurrency';
import { useModelFieldGroup } from '../../../hooks/form';

export const ModelFieldGroupCurrencyVertical = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupCurrency {...fieldGroupProps} />;
};

ModelFieldGroupCurrencyVertical.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelFieldGroupHorizontalCurrency = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupHorizontalCurrency {...fieldGroupProps} />;
};

export const ModelFieldGroupFloatingCurrency = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupFloatingCurrency {...fieldGroupProps} />;
};

export const ModelFieldGroupCurrency = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldGroupCurrency',
    ModelFieldGroupCurrencyVertical,
    props
  );
