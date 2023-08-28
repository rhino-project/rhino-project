import { useCallback } from 'react';
import DisplayString from 'rhino/components/forms/displays/DisplayString';

const ModelDisplayAttachments = ({ model, ...props }) => {
  const accessor = useCallback(
    (value) => (value?.length ? `${value?.length} files` : undefined),
    []
  );

  return <DisplayString accessor={accessor} {...props} />;
};

export default ModelDisplayAttachments;
