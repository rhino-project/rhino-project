import DisplayBoolean from 'rhino/components/forms/displays/DisplayBoolean';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

export const ModelDisplayBooleanBase = ({ model, ...props }) => (
  <DisplayBoolean {...props} />
);

const defaultComponents = { ModelDisplayBoolean: ModelDisplayBooleanBase };

const ModelDisplayBoolean = ({ overrides, ...props }) => {
  const { ModelDisplayBoolean } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelDisplayBoolean {...props} />;
};

export default ModelDisplayBoolean;
