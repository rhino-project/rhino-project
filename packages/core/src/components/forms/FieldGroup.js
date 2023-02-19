import { useGlobalOverrides } from 'rhino/hooks/overrides';
import FieldLayoutVertical from './FieldLayoutVertical';

const defaultComponents = {
  FieldLayout: FieldLayoutVertical
};

export const FieldGroup = ({ overrides, ...props }) => {
  const { FieldLayout } = useGlobalOverrides(defaultComponents, overrides);

  return <FieldLayout {...props} />;
};

export default FieldGroup;
