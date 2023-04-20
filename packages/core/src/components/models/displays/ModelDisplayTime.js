import DisplayTime from 'rhino/components/forms/displays/DisplayTime';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

export const ModelDisplayTimeBase = ({ model, ...props }) => (
  <DisplayTime {...props} />
);

const defaultComponents = { ModelDisplayTime: ModelDisplayTimeBase };

const ModelDisplayTime = ({ overrides, ...props }) => {
  const { ModelDisplayTime } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelDisplayTime {...props} />;
};

export default ModelDisplayTime;
