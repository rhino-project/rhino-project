import DisplayBoolean from 'rhino/components/forms/displays/DisplayBoolean';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';

export const ModelDisplayBooleanBase = ({ model, ...props }) => (
  <DisplayBoolean {...props} />
);

const ModelDisplayBoolean = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayBoolean',
    ModelDisplayBooleanBase,
    props
  );

export default ModelDisplayBoolean;
