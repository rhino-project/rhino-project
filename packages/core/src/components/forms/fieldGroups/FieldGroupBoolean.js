import {
  useGlobalComponent,
  useMergedOverrides
} from '../../../hooks/overrides';
import { FieldLayoutVertical } from '../FieldLayoutVertical';
import { FieldBoolean } from '../fields/FieldBoolean';

const BASE_OVERRIDES = {
  FormGroup: { props: { check: true } },
  Field: FieldBoolean,
  FieldLabel: { props: { check: true } }
};

export const FieldGroupBooleanBase = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldLayoutVertical overrides={mergedOverrides} {...props} />;
};

// Horizontal and floating are the same as vertical
const FieldGroupHorizontalBoolean = FieldGroupBooleanBase;
export { FieldGroupHorizontalBoolean };

const FieldGroupFloatingBoolean = FieldGroupBooleanBase;
export { FieldGroupFloatingBoolean };

export const FieldGroupBoolean = (props) =>
  useGlobalComponent('FieldGroupBoolean', FieldGroupBooleanBase, props);
