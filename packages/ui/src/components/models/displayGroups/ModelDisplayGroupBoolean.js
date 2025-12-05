import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from '@rhino-project/core/hooks';
import { useModelDisplayGroup } from '@rhino-project/core/hooks';
import {
  DisplayGroupBoolean,
  DisplayGroupFloatingBoolean,
  DisplayGroupHorizontalBoolean
} from '../../forms/displayGroups/DisplayGroupBoolean';

export const ModelDisplayGroupVerticalBoolean = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupBoolean {...fieldGroupProps} />;
};

ModelDisplayGroupVerticalBoolean.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelDisplayGroupHorizontalBoolean = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupHorizontalBoolean {...fieldGroupProps} />;
};

export const ModelDisplayGroupFloatingBoolean = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupFloatingBoolean {...fieldGroupProps} />;
};

export const ModelDisplayGroupBoolean = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayGroupBoolean',
    ModelDisplayGroupVerticalBoolean,
    props
  );
