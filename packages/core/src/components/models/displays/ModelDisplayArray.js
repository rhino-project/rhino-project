import DisplayArray from 'rhino/components/forms/displays/DisplayArray';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';

// eslint-disable-next-line no-unused-vars
export const ModelDisplayArrayBase = ({ model, ...props }) => (
  <DisplayArray {...props} />
);

const ModelDisplayArray = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayArray',
    ModelDisplayArrayBase,
    props
  );

export default ModelDisplayArray;
