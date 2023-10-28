import DisplayString from 'rhino/components/forms/displays/DisplayString';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';

// eslint-disable-next-line no-unused-vars
export const ModelDisplayStringBase = ({ model, ...props }) => (
  <DisplayString {...props} />
);

const ModelDisplayString = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayString',
    ModelDisplayStringBase,
    props
  );

export default ModelDisplayString;
