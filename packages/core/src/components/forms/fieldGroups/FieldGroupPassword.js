import { useMergedOverrides } from 'rhino/hooks/overrides';
import FieldGroup from '../FieldGroup';
import FieldPassword from '../fields/FieldPassword';

const BASE_OVERRIDES = { FieldLayout: { Field: FieldPassword } };

export const FieldGroupPassword = ({ overrides, ...props }) => {
  const mergedOverrides = useMergedOverrides(BASE_OVERRIDES, overrides);

  return <FieldGroup overrides={mergedOverrides} {...props} />;
};

export default FieldGroupPassword;
