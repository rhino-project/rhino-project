import { useGlobalComponent, useMergedOverrides } from '../../../hooks/overrides';
import { DisplayLayoutVertical } from '../DisplayLayoutVertical';
import { DisplayLayoutHorizontal } from '../DisplayLayoutHorizontal';
import { DisplayLayoutFloating } from '../DisplayLayoutFloating';
import { DisplayString } from '../displays/DisplayString';

const BASE_OVERRIDES = {
  Display: DisplayString
};

const accessor = (value) =>
  value?.length ? `${value?.length} files` : undefined;

export const DisplayGroupVerticalAttachments = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return (
    <DisplayLayoutVertical
      overrides={mergedOverrides}
      accessor={accessor}
      {...props}
    />
  );
};

export const DisplayGroupHorizontalAttachments = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return (
    <DisplayLayoutHorizontal
      overrides={mergedOverrides}
      accessor={accessor}
      {...props}
    />
  );
};

export const DisplayGroupFloatingAttachments = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return (
    <DisplayLayoutFloating
      overrides={mergedOverrides}
      accessor={accessor}
      {...props}
    />
  );
};

export const DisplayGroupAttachments = (props) =>
  useGlobalComponent(
    'DisplayGroupAttachments',
    DisplayGroupVerticalAttachments,
    props
  );
