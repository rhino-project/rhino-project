import PropTypes from 'prop-types';
import {
  useGlobalComponentForAttribute,
  useModelDisplayGroup
} from '@rhino-project/core/hooks';
import {
  DisplayGroupArray,
  DisplayGroupFloatingArray,
  DisplayGroupHorizontalArray
} from '../../forms/displayGroups/DisplayGroupArray';

export const ModelDisplayGroupVerticalArray = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupArray {...fieldGroupProps} />;
};

ModelDisplayGroupVerticalArray.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelDisplayGroupHorizontalArray = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupHorizontalArray {...fieldGroupProps} />;
};

export const ModelDisplayGroupFloatingArray = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupFloatingArray {...fieldGroupProps} />;
};

export const ModelDisplayGroupArray = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayGroupArray',
    ModelDisplayGroupVerticalArray,
    props
  );
