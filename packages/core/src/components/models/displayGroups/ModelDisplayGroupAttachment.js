import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import { useModelDisplayFieldGroupAttachment } from '../../../hooks/form';
import {
  DisplayGroupAttachment,
  DisplayGroupFloatingAttachment,
  DisplayGroupHorizontalAttachment,
} from '../../forms/displayGroups/DisplayGroupAttachment';

export const ModelDisplayGroupVerticalAttachment = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayFieldGroupAttachment(props);

  return <DisplayGroupAttachment {...fieldGroupProps} />;
};

ModelDisplayGroupVerticalAttachment.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelDisplayGroupHorizontalAttachment = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayFieldGroupAttachment(props);

  return <DisplayGroupHorizontalAttachment {...fieldGroupProps} />;
};

export const ModelDisplayGroupFloatingAttachment = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayFieldGroupAttachment(props);

  return <DisplayGroupFloatingAttachment {...fieldGroupProps} />;
};

export const ModelDisplayGroupAttachment = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayGroupAttachment',
    ModelDisplayGroupVerticalAttachment,
    props
  );
