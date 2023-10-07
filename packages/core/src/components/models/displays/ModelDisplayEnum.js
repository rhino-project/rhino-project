import DisplayString from 'rhino/components/forms/displays/DisplayString';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';

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
