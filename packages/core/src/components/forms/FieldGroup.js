import { useGlobalComponent, useOverrides } from 'rhino/hooks/overrides';
import FieldLayoutVertical from './FieldLayoutVertical';

const defaultComponents = {
  FieldLayout: FieldLayoutVertical
};

export const FieldGroupBase = ({ overrides, ...props }) => {
  const { FieldLayout } = useOverrides(defaultComponents, overrides);

  return <FieldLayout {...props} />;
};

const FieldGroup = (props) =>
  useGlobalComponent('FieldGroup', FieldGroupBase, props);

export default FieldGroup;
