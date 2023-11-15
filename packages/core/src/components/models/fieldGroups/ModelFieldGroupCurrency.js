import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import FieldGroupCurrency, {
  FieldGroupFloatingCurrency,
  FieldGroupHorizontalCurrency
} from 'rhino/components/forms/fieldGroups/FieldGroupCurrency';
import { useModelFieldGroup } from 'rhino/hooks/form';

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

const ModelFieldGroupCurrency = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldGroupCurrency',
    ModelFieldGroupCurrencyVertical,
    props
  );

export default ModelFieldGroupCurrency;
