import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import FieldGroupDate, { FieldGroupFloatingDate, FieldGroupHorizontalDate } from '../../forms/fieldGroups/FieldGroupDate';
import { useModelFieldGroup } from '../../../hooks/form';

export const ModelFieldGroupDateVertical = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupDate {...fieldGroupProps} />;
};

ModelFieldGroupDateVertical.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelFieldGroupHorizontalDate = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupHorizontalDate {...fieldGroupProps} />;
};

export const ModelFieldGroupFloatingDate = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupFloatingDate {...fieldGroupProps} />;
};

export const ModelFieldGroupDate = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldGroupDate',
    ModelFieldGroupDateVertical,
    props
  );
