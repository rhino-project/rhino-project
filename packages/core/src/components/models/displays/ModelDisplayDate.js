import DisplayDate from 'rhino/components/forms/displays/DisplayDate';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';

export const ModelDisplayDateBase = ({ model, ...props }) => (
  <DisplayDate {...props} />
);

const ModelDisplayDate = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayDate',
    ModelDisplayDateBase,
    props
  );

export default ModelDisplayDate;
