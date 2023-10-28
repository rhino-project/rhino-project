import DisplayString from 'rhino/components/forms/displays/DisplayString';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';

// eslint-disable-next-line no-unused-vars
const ModelDisplayEnumBase = ({ model, ...props }) => (
  <DisplayString {...props} />
);

const ModelDisplayEnum = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayEnum',
    ModelDisplayEnumBase,
    props
  );

export default ModelDisplayEnum;
