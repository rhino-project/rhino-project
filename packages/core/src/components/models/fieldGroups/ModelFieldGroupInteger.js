import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import FieldGroupInteger, {
  FieldGroupFloatingInteger,
  FieldGroupHorizontalInteger
} from 'rhino/components/forms/fieldGroups/FieldGroupInteger';
import { useModelFieldGroup } from 'rhino/hooks/form';

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

const ModelFieldGroupInteger = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldGroupInteger',
    ModelFieldGroupIntegerVertical,
    props
  );

export default ModelFieldGroupInteger;
