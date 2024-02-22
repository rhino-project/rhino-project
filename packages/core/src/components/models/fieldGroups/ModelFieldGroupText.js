import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import { FieldGroupText, FieldGroupFloatingText, FieldGroupHorizontalText } from '../../forms/fieldGroups/FieldGroupText';
import { useModelFieldGroup } from '../../../hooks/form';

export const ModelFieldGroupTextVertical = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupText {...fieldGroupProps} />;
};

ModelFieldGroupTextVertical.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelFieldGroupHorizontalText = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupHorizontalText {...fieldGroupProps} />;
};

export const ModelFieldGroupFloatingText = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupFloatingText {...fieldGroupProps} />;
};

export const ModelFieldGroupText = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldGroupText',
    ModelFieldGroupTextVertical,
    props
  );
