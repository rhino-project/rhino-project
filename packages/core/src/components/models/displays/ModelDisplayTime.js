import DisplayTime from 'rhino/components/forms/displays/DisplayTime';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';

export const ModelDisplayTimeBase = ({ model, ...props }) => (
  <DisplayTime {...props} />
);

const ModelDisplayTime = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayTime',
    ModelDisplayTimeBase,
    props
  );

export default ModelDisplayTime;
