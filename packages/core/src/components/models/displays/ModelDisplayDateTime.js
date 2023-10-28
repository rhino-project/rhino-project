import DisplayDateTime from 'rhino/components/forms/displays/DisplayDateTime';
import { useGlobalComponentForAttribute } from 'rhino/hooks/overrides';

// eslint-disable-next-line no-unused-vars
export const ModelDisplayDateTimeBase = ({ model, ...props }) => (
  <DisplayDateTime {...props} />
);

const ModelDisplayDateTime = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayDateTime',
    ModelDisplayDateTimeBase,
    props
  );

export default ModelDisplayDateTime;
