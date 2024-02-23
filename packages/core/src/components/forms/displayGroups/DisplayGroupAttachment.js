import {
  useGlobalComponent,
  useMergedOverrides
} from '../../../hooks/overrides';
import { DisplayLayoutVertical } from '../DisplayLayoutVertical';
import { DisplayLayoutHorizontal } from '../DisplayLayoutHorizontal';
import { DisplayLink } from '../displays/DisplayLink';

const BASE_OVERRIDES = {
  Display: DisplayLink
};

export const DisplayGroupVerticalAttachment = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <DisplayLayoutVertical overrides={mergedOverrides} {...props} />;
};

export const DisplayGroupHorizontalAttachment = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <DisplayLayoutHorizontal overrides={mergedOverrides} {...props} />;
};

const DisplayGroupFloatingAttachment = DisplayGroupVerticalAttachment;
export { DisplayGroupFloatingAttachment };

export const DisplayGroupAttachment = (props) =>
  useGlobalComponent(
    'DisplayGroupAttachment',
    DisplayGroupVerticalAttachment,
    props
  );
