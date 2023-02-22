import { useGlobalOverrides } from 'rhino/hooks/overrides';
import FieldLayoutVertical from './FieldLayoutVertical';

const defaultComponents = {
  FieldLayout: FieldLayoutVertical
};

export const FieldGroup = ({ overrides, ...props }) => {
  // FIXME: Is re-using the name for overrides and creating nested overrides a good idea?
  const { FieldLayout } = useGlobalOverrides(defaultComponents, overrides);

  return <FieldLayout {...props} />;
};

export default FieldGroup;
