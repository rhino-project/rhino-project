import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from '@rhino-project/core/hooks';
import {
  FieldGroupPhone,
  FieldGroupFloatingPhone,
  FieldGroupHorizontalPhone
} from '../../forms/fieldGroups/FieldGroupPhone';
import { useModelFieldGroup } from '@rhino-project/core/hooks';

export const ModelFieldGroupPhoneVertical = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupPhone {...fieldGroupProps} />;
};

ModelFieldGroupPhoneVertical.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelFieldGroupHorizontalPhone = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupHorizontalPhone {...fieldGroupProps} />;
};

export const ModelFieldGroupFloatingPhone = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupFloatingPhone {...fieldGroupProps} />;
};

export const ModelFieldGroupPhone = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldGroupPhone',
    ModelFieldGroupPhoneVertical,
    props
  );
