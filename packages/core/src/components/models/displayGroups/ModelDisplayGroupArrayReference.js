import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import { useModelDisplayGroup } from '../../../hooks/form';
import {
  DisplayGroupArrayReference,
  DisplayGroupFloatingArrayReference,
  DisplayGroupHorizontalArrayReference
} from '../../forms/displayGroups/DisplayGroupArrayReference';

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

export const ModelDisplayGroupArrayReference = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayGroupArrayReference',
    ModelDisplayGroupVerticalArrayReference,
    props
  );
