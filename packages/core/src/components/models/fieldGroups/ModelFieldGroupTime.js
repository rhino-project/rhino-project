import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import FieldGroupTime, {
  FieldGroupFloatingTime,
  FieldGroupHorizontalTime
} from 'rhino/components/forms/fieldGroups/FieldGroupTime';
import { useModelFieldGroup } from 'rhino/hooks/form';

export const ModelFieldGroupTimeVertical = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupTime {...fieldGroupProps} />;
};

ModelFieldGroupTimeVertical.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelFieldGroupHorizontalTime = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupHorizontalTime {...fieldGroupProps} />;
};

export const ModelFieldGroupFloatingTime = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupFloatingTime {...fieldGroupProps} />;
};

const ModelFieldGroupTime = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldGroupTime',
    ModelFieldGroupTimeVertical,
    props
  );

export default ModelFieldGroupTime;
