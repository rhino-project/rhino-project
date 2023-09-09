import { useCallback, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import DisplayLink from 'rhino/components/forms/displays/DisplayLink';

const ModelDisplayAttachment = ({ children, model, ...props }) => {
  const accessor = useCallback((value) => value?.url, []);
  const watch = useWatch({ name: props.path });

  const linkText = useMemo(
    () => children || watch?.display_name,
    [children, watch]
  );

  return (
    <DisplayLink accessor={accessor} {...props}>
      {linkText}
    </DisplayLink>
  );
};

export default ModelDisplayAttachment;
