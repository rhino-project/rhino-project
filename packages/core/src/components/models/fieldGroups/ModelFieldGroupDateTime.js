import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import {
  FieldGroupDateTime,
  FieldGroupFloatingDateTime,
  FieldGroupHorizontalDateTime,
} from '../../forms/fieldGroups/FieldGroupDateTime';
import { useModelFieldGroup } from '../../../hooks/form';

export const ModelFieldGroupDateTimeVertical = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupDateTime {...fieldGroupProps} />;
};

ModelFieldGroupDateTimeVertical.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelFieldGroupHorizontalDateTime = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupHorizontalDateTime {...fieldGroupProps} />;
};

export const ModelFieldGroupFloatingDateTime = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupFloatingDateTime {...fieldGroupProps} />;
};

export const ModelFieldGroupDateTime = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldGroupDateTime',
    ModelFieldGroupDateTimeVertical,
    props
  );
