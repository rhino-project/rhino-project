import { useGlobalComponent, useMergedOverrides } from '../../../hooks/overrides';
import DisplayLayoutVertical from '../DisplayLayoutVertical';
import DisplayLayoutHorizontal from '../DisplayLayoutHorizontal';
import DisplayImage from '../displays/DisplayImage';

const BASE_OVERRIDES = {
  Display: DisplayImage
};

export const DisplayGroupVerticalAttachmentImage = ({
  overrides,
  ...props
}) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <DisplayLayoutVertical overrides={mergedOverrides} {...props} />;
};

export const DisplayGroupHorizontalAttachmentImage = ({
  overrides,
  ...props
}) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <DisplayLayoutHorizontal overrides={mergedOverrides} {...props} />;
};

const DisplayGroupFloatingAttachmentImage = DisplayGroupVerticalAttachmentImage;
export { DisplayGroupFloatingAttachmentImage };

const DisplayGroupAttachmentImage = (props) =>
  useGlobalComponent(
    'DisplayGroupAttachmentImage',
    DisplayGroupVerticalAttachmentImage,
    props
  );

export default DisplayGroupAttachmentImage;
