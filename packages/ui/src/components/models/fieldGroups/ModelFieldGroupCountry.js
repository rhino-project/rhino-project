import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from '@rhino-project/core/hooks';
import {
  FieldGroupCountry,
  FieldGroupFloatingCountry,
  FieldGroupHorizontalCountry
} from '../../forms/fieldGroups/FieldGroupCountry';
import { useModelFieldGroup } from '@rhino-project/core/hooks';

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

export const ModelFieldGroupCountry = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldGroupCountry',
    ModelFieldGroupCountryVertical,
    props
  );
