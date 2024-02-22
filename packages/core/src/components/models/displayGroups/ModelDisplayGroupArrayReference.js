import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import { useModelDisplayGroup } from 'rhino/hooks/form';
import DisplayGroupArrayReference, {
  DisplayGroupFloatingArrayReference,
  DisplayGroupHorizontalArrayReference
} from 'rhino/components/forms/displayGroups/DisplayGroupArrayReference';

export const ModelDisplayGroupVerticalArrayReference = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupArrayReference {...fieldGroupProps} />;
};

ModelDisplayGroupVerticalArrayReference.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelDisplayGroupHorizontalArrayReference = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupHorizontalArrayReference {...fieldGroupProps} />;
};

export const ModelDisplayGroupFloatingArrayReference = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupFloatingArrayReference {...fieldGroupProps} />;
};

const ModelDisplayGroupArrayReference = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayGroupArrayReference',
    ModelDisplayGroupVerticalArrayReference,
    props
  );

export default ModelDisplayGroupArrayReference;
