import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import { useModelDisplayGroup } from '../../../hooks/form';
import DisplayGroupAttachments, { DisplayGroupFloatingAttachments, DisplayGroupHorizontalAttachments } from '../../forms/displayGroups/DisplayGroupAttachments';

export const ModelDisplayGroupVerticalAttachments = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupAttachments {...fieldGroupProps} />;
};

ModelDisplayGroupVerticalAttachments.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelDisplayGroupHorizontalAttachments = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupHorizontalAttachments {...fieldGroupProps} />;
};

export const ModelDisplayGroupFloatingAttachments = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayGroup(props);

  return <DisplayGroupFloatingAttachments {...fieldGroupProps} />;
};

const ModelDisplayGroupAttachments = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayGroupAttachments',
    ModelDisplayGroupVerticalAttachments,
    props
  );

export default ModelDisplayGroupAttachments;
