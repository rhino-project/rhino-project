import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from '@rhino-project/core/hooks';
import {
  FieldGroupInteger,
  FieldGroupFloatingInteger,
  FieldGroupHorizontalInteger
} from '../../forms/fieldGroups/FieldGroupInteger';
import { useModelFieldGroup } from '@rhino-project/core/hooks';

export const ModelFieldGroupIntegerVertical = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupInteger {...fieldGroupProps} />;
};

ModelFieldGroupIntegerVertical.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelFieldGroupHorizontalInteger = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupHorizontalInteger {...fieldGroupProps} />;
};

export const ModelFieldGroupFloatingInteger = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupFloatingInteger {...fieldGroupProps} />;
};

export const ModelFieldGroupInteger = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldGroupInteger',
    ModelFieldGroupIntegerVertical,
    props
  );
