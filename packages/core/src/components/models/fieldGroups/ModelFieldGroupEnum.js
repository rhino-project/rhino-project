import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import { useModelFieldGroupEnum } from '../../../hooks/form';
import FieldGroupSelectControlled, { FieldGroupFloatingSelectControlled, FieldGroupHorizontalSelectControlled } from '../../forms/fieldGroups/FieldGroupSelectControlled';

export const ModelFieldGroupEnumVertical = (props) => {
  const { fieldGroupProps } = useModelFieldGroupEnum(props);

  return <FieldGroupSelectControlled {...fieldGroupProps} />;
};

ModelFieldGroupEnumVertical.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelFieldGroupHorizontalEnum = (props) => {
  const { fieldGroupProps } = useModelFieldGroupEnum(props);

  return <FieldGroupHorizontalSelectControlled {...fieldGroupProps} />;
};

export const ModelFieldGroupFloatingEnum = (props) => {
  const { fieldGroupProps } = useModelFieldGroupEnum(props);

  return <FieldGroupFloatingSelectControlled {...fieldGroupProps} />;
};

export const ModelFieldGroupEnum = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldGroupEnum',
    ModelFieldGroupEnumVertical,
    props
  );
