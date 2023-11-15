import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import { useModelDisplayGroup } from 'rhino/hooks/form';
import DisplayGroupArray, {
  DisplayGroupFloatingArray,
  DisplayGroupHorizontalArray
} from 'rhino/components/forms/displayGroups/DisplayGroupArray';

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

const ModelDisplayGroupArray = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayGroupArray',
    ModelDisplayGroupVerticalArray,
    props
  );

export default ModelDisplayGroupArray;
