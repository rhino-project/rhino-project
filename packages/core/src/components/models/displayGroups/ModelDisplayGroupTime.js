import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import { useModelDisplayGroup } from '../../../hooks/form';
import DisplayGroupTime, { DisplayGroupFloatingTime, DisplayGroupHorizontalTime } from '../../forms/displayGroups/DisplayGroupTime';

export const ModelDisplayGroupVerticalTime = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupTime {...fieldGroupProps} />;
};

ModelDisplayGroupVerticalTime.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelDisplayGroupHorizontalTime = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupHorizontalTime {...fieldGroupProps} />;
};

export const ModelDisplayGroupFloatingTime = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupFloatingTime {...fieldGroupProps} />;
};

const ModelDisplayGroupTime = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayGroupTime',
    ModelDisplayGroupVerticalTime,
    props
  );

export default ModelDisplayGroupTime;
