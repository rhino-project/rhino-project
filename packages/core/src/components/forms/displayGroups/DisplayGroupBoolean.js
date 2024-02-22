import { useGlobalComponent, useMergedOverrides } from '../../../hooks/overrides';
import DisplayLayoutVertical from '../DisplayLayoutVertical';
import DisplayBoolean from '../displays/DisplayBoolean';

const BASE_OVERRIDES = {
  FormGroup: { props: { check: true } },
  Display: DisplayBoolean,
  DisplayLabel: { props: { check: true } }
};

export const DisplayGroupBooleanBase = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <DisplayLayoutVertical overrides={mergedOverrides} {...props} />;
};

// Horizontal and floating are the same as vertical
const DisplayGroupHorizontalBoolean = DisplayGroupBooleanBase;
export { DisplayGroupHorizontalBoolean };

const DisplayGroupFloatingBoolean = DisplayGroupBooleanBase;
export { DisplayGroupFloatingBoolean };

export const DisplayGroupBoolean = (props) =>
  useGlobalComponent('DisplayGroupBoolean', DisplayGroupBooleanBase, props);
