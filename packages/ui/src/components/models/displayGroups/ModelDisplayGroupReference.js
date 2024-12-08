import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from '@rhino-project/core/hooks';
import { useModelDisplayGroup } from '@rhino-project/core/hooks';
import {
  DisplayGroupReference,
  DisplayGroupFloatingReference,
  DisplayGroupHorizontalReference
} from '../../forms/displayGroups/DisplayGroupReference';

export const ModelDisplayGroupVerticalReference = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupReference {...fieldGroupProps} />;
};

ModelDisplayGroupVerticalReference.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelDisplayGroupHorizontalReference = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupHorizontalReference {...fieldGroupProps} />;
};

export const ModelDisplayGroupFloatingReference = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupFloatingReference {...fieldGroupProps} />;
};

export const ModelDisplayGroupReference = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayGroupReference',
    ModelDisplayGroupVerticalReference,
    props
  );
