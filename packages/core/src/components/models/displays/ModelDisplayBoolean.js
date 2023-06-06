import DisplayBoolean from 'rhino/components/forms/displays/DisplayBoolean';
import { useGlobalComponent } from 'rhino/hooks/overrides';

export const ModelDisplayBooleanBase = ({ model, ...props }) => (
  <DisplayBoolean {...props} />
);

const ModelDisplayBoolean = (props) =>
  useGlobalComponent('ModelDisplayBoolean', ModelDisplayBooleanBase, props);

export default ModelDisplayBoolean;
