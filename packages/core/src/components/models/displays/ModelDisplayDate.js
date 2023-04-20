import DisplayDate from 'rhino/components/forms/displays/DisplayDate';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

export const ModelDisplayDateBase = ({ model, ...props }) => (
  <DisplayDate {...props} />
);

const defaultComponents = { ModelDisplayDate: ModelDisplayDateBase };

const ModelDisplayDate = ({ overrides, ...props }) => {
  const { ModelDisplayDate } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelDisplayDate {...props} />;
};

export default ModelDisplayDate;
