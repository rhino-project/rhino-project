import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import { useModelFieldGroupEnum } from 'rhino/hooks/form';
import FieldGroupSelectControlled, {
  FieldGroupFloatingSelectControlled,
  FieldGroupHorizontalSelectControlled
} from 'rhino/components/forms/fieldGroups/FieldGroupSelectControlled';

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

const ModelFieldGroupEnum = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldGroupEnum',
    ModelFieldGroupEnumVertical,
    props
  );

export default ModelFieldGroupEnum;
