import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import { useModelDisplayGroup } from 'rhino/hooks/form';
import DisplayGroupDate, {
  DisplayGroupFloatingDate,
  DisplayGroupHorizontalDate
} from 'rhino/components/forms/displayGroups/DisplayGroupDate';

export const ModelDisplayGroupVerticalDate = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupDate {...fieldGroupProps} />;
};

ModelDisplayGroupVerticalDate.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelDisplayGroupHorizontalDate = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupHorizontalDate {...fieldGroupProps} />;
};

export const ModelDisplayGroupFloatingDate = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupFloatingDate {...fieldGroupProps} />;
};

const ModelDisplayGroupDate = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayGroupDate',
    ModelDisplayGroupVerticalDate,
    props
  );

export default ModelDisplayGroupDate;
