import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import { useModelDisplayGroup } from '../../../hooks/form';
import {
  DisplayGroupDateTime,
  DisplayGroupFloatingDateTime,
  DisplayGroupHorizontalDateTime
} from '../../forms/displayGroups/DisplayGroupDateTime';

export const ModelDisplayGroupVerticalDateTime = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupDateTime {...fieldGroupProps} />;
};

ModelDisplayGroupVerticalDateTime.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelDisplayGroupHorizontalDateTime = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupHorizontalDateTime {...fieldGroupProps} />;
};

export const ModelDisplayGroupFloatingDateTime = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupFloatingDateTime {...fieldGroupProps} />;
};

export const ModelDisplayGroupDateTime = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayGroupDateTime',
    ModelDisplayGroupVerticalDateTime,
    props
  );
