import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from '@rhino-project/core/hooks';
import {
  FieldGroupFile,
  FieldGroupFloatingFile,
  FieldGroupHorizontalFile
} from '../../forms/fieldGroups/FieldGroupFile';
import { useModelFieldGroup } from '@rhino-project/core/hooks';

export const ModelFieldGroupFileVertical = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupFile {...fieldGroupProps} />;
};

ModelFieldGroupFileVertical.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelFieldGroupHorizontalFile = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupHorizontalFile {...fieldGroupProps} />;
};

export const ModelFieldGroupFloatingFile = (props) => {
  const { fieldGroupProps } = useModelFieldGroup(props);

  return <FieldGroupFloatingFile {...fieldGroupProps} />;
};

export const ModelFieldGroupFile = (props) =>
  useGlobalComponentForAttribute(
    'ModelFieldGroupFile',
    ModelFieldGroupFileVertical,
    props
  );
