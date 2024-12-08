import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from '@rhino-project/core/hooks';
import {
  FieldGroupFloat,
  FieldGroupFloatingFloat,
  FieldGroupHorizontalFloat
} from '../../forms/fieldGroups/FieldGroupFloat';
import { useModelFieldGroup } from '@rhino-project/core/hooks';

export const ModelFieldGroupFloatVertical = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupFloat {...fieldGroupProps} />;
};

ModelFieldGroupFloatVertical.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelFieldGroupHorizontalFloat = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupHorizontalFloat {...fieldGroupProps} />;
};

export const ModelFieldGroupFloatingFloat = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupFloatingFloat {...fieldGroupProps} />;
};

export const ModelFieldGroupFloat = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldGroupFloat',
    ModelFieldGroupFloatVertical,
    props
  );
