import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import { useModelDisplayGroup } from 'rhino/hooks/form';
import DisplayGroupTime, {
  DisplayGroupFloatingTime,
  DisplayGroupHorizontalTime
} from 'rhino/components/forms/displayGroups/DisplayGroupTime';

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
