import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import FieldGroupString, { FieldGroupFloatingString, FieldGroupHorizontalString } from '../../forms/fieldGroups/FieldGroupString';
import { useModelFieldGroup } from '../../../hooks/form';

export const ModelFieldGroupStringVertical = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupString {...fieldGroupProps} />;
};

ModelFieldGroupStringVertical.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelFieldGroupHorizontalString = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupHorizontalString {...fieldGroupProps} />;
};

export const ModelFieldGroupFloatingString = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupFloatingString {...fieldGroupProps} />;
};

export const ModelFieldGroupString = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldGroupString',
    ModelFieldGroupStringVertical,
    props
  );
