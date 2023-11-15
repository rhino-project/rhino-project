import PropTypes from 'prop-types';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';
import { useModelDisplayFieldGroupAttachmentImage } from 'rhino/hooks/form';
import DisplayGroupAttachmentImage, {
  DisplayGroupFloatingAttachmentImage,
  DisplayGroupHorizontalAttachmentImage
} from 'rhino/components/forms/displayGroups/DisplayGroupAttachmentImage';

export const ModelDisplayGroupVerticalAttachmentImage = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayFieldGroupAttachmentImage(props);

  return <DisplayGroupAttachmentImage {...fieldGroupProps} />;
};

ModelDisplayGroupVerticalAttachmentImage.propTypes = {
  label: PropTypes.string,
  labelHidden: PropTypes.bool,
  model: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  path: PropTypes.string.isRequired
};

export const ModelDisplayGroupHorizontalAttachmentImage = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayFieldGroupAttachmentImage(props);

  return <DisplayGroupHorizontalAttachmentImage {...fieldGroupProps} />;
};

export const ModelDisplayGroupFloatingAttachmentImage = (props) => {
  // FIXME - displayGroupProps instead?
  const { fieldGroupProps } = useModelDisplayFieldGroupAttachmentImage(props);

  return <DisplayGroupFloatingAttachmentImage {...fieldGroupProps} />;
};

const ModelDisplayGroupAttachmentImage = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayGroupAttachmentImage',
    ModelDisplayGroupVerticalAttachmentImage,
    props
  );

export default ModelDisplayGroupAttachmentImage;
