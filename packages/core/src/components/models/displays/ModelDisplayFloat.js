import DisplayFloat from 'rhino/components/forms/displays/DisplayFloat';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';

// eslint-disable-next-line no-unused-vars
export const ModelDisplayFloatBase = ({ model, ...props }) => (
  <DisplayFloat {...props} />
);

const ModelDisplayFloat = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayFloat',
    ModelDisplayFloatBase,
    props
  );

export default ModelDisplayFloat;
