import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import { useModelDisplayGroup } from '../../../hooks/form';
import {
  DisplayGroupInteger,
  DisplayGroupFloatingInteger,
  DisplayGroupHorizontalInteger
} from '../../forms/displayGroups/DisplayGroupInteger';

export const ModelDisplayGroupVerticalInteger = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupInteger {...fieldGroupProps} />;
};

ModelDisplayGroupVerticalInteger.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelDisplayGroupHorizontalInteger = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupHorizontalInteger {...fieldGroupProps} />;
};

export const ModelDisplayGroupFloatingInteger = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupFloatingInteger {...fieldGroupProps} />;
};

export const ModelDisplayGroupInteger = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayGroupInteger',
    ModelDisplayGroupVerticalInteger,
    props
  );
