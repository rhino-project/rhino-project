import DisplayDateTime from 'rhino/components/forms/displays/DisplayDateTime';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

export const ModelDisplayDateTimeBase = ({ model, ...props }) => (
  <DisplayDateTime {...props} />
);

const defaultComponents = { ModelDisplayDateTime: ModelDisplayDateTimeBase };

const ModelDisplayDateTime = ({ overrides, ...props }) => {
  const { ModelDisplayDateTime } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelDisplayDateTime {...props} />;
};

export default ModelDisplayDateTime;
