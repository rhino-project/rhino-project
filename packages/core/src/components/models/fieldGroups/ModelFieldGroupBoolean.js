import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import { FieldGroupBoolean, FieldGroupFloatingBoolean, FieldGroupHorizontalBoolean } from '../../forms/fieldGroups/FieldGroupBoolean';
import { useModelFieldGroup } from '../../../hooks/form';

export const ModelFieldGroupBooleanVertical = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupBoolean {...fieldGroupProps} />;
};

ModelFieldGroupBooleanVertical.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelFieldGroupHorizontalBoolean = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupHorizontalBoolean {...fieldGroupProps} />;
};

export const ModelFieldGroupFloatingBoolean = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupFloatingBoolean {...fieldGroupProps} />;
};

export const ModelFieldGroupBoolean = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldGroupBoolean',
    ModelFieldGroupBooleanVertical,
    props
  );
