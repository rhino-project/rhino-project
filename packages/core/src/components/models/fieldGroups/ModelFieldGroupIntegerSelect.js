import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import { useModelFieldGroupIntegerSelect } from 'rhino/hooks/form';
import FieldGroupSelectControlled, {
  FieldGroupFloatingSelectControlled,
  FieldGroupHorizontalSelectControlled
} from 'rhino/components/forms/fieldGroups/FieldGroupSelectControlled';

export const ModelFieldGroupIntegerSelectVertical = (props) => {
  const { fieldGroupProps } = useModelFieldGroupIntegerSelect(props);

  return <FieldGroupSelectControlled {...fieldGroupProps} />;
};

ModelFieldGroupIntegerSelectVertical.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelFieldGroupHorizontalIntegerSelect = (props) => {
  const { fieldGroupProps } = useModelFieldGroupIntegerSelect(props);

  return <FieldGroupFloatingSelectControlled {...fieldGroupProps} />;
};

export const ModelFieldGroupFloatingIntegerSelect = (props) => {
  const { fieldGroupProps } = useModelFieldGroupIntegerSelect(props);

  return <FieldGroupHorizontalSelectControlled {...fieldGroupProps} />;
};

const ModelFieldGroupIntegerSelect = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldGroupIntegerSelect',
    ModelFieldGroupIntegerSelectVertical,
    props
  );

export default ModelFieldGroupIntegerSelect;
