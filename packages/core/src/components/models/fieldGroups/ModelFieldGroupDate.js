import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import FieldGroupDate, {
  FieldGroupFloatingDate,
  FieldGroupHorizontalDate
} from 'rhino/components/forms/fieldGroups/FieldGroupDate';
import { useModelFieldGroup } from 'rhino/hooks/form';

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

const ModelFieldGroupDate = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldGroupDate',
    ModelFieldGroupDateVertical,
    props
  );

export default ModelFieldGroupDate;
