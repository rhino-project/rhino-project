import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import FieldGroupCountry, {
  FieldGroupFloatingCountry,
  FieldGroupHorizontalCountry
} from 'rhino/components/forms/fieldGroups/FieldGroupCountry';
import { useModelFieldGroup } from 'rhino/hooks/form';

export const ModelFieldGroupCountryVertical = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupCountry {...fieldGroupProps} />;
};

ModelFieldGroupCountryVertical.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelFieldGroupHorizontalCountry = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupHorizontalCountry {...fieldGroupProps} />;
};

export const ModelFieldGroupFloatingCountry = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupFloatingCountry {...fieldGroupProps} />;
};

const ModelFieldGroupCountry = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldGroupCountry',
    ModelFieldGroupCountryVertical,
    props
  );

export default ModelFieldGroupCountry;
