import {
  useGlobalComponent,
  useMergedOverrides
} from '../../../hooks/overrides';
import { DisplayLayoutVertical } from '../DisplayLayoutVertical';
import { DisplayDateTime } from '../displays/DisplayDateTime';
import { DisplayLayoutHorizontal } from '../DisplayLayoutHorizontal';
import { DisplayLayoutFloating } from '../DisplayLayoutFloating';

const BASE_OVERRIDES = {
  Display: DisplayDateTime
};

export const DisplayGroupVerticalDateTime = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <DisplayLayoutVertical overrides={mergedOverrides} {...props} />;
};

export const DisplayGroupHorizontalDateTime = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <DisplayLayoutHorizontal overrides={mergedOverrides} {...props} />;
};

export const DisplayGroupFloatingDateTime = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <DisplayLayoutFloating overrides={mergedOverrides} {...props} />;
};

export const DisplayGroupDateTime = (props) =>
  useGlobalComponent(
    'DisplayGroupDateTime',
    DisplayGroupVerticalDateTime,
    props
  );
