import { useCallback, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import DisplayImage from 'rhino/components/forms/displays/DisplayImage';

const ModelDisplayAttachmentImage = ({ children, model, ...props }) => {
  const accessor = useCallback((value) => value?.url, []);
  const watch = useWatch({ name: props.path });

  const altText = useMemo(() => watch?.display_name, [watch]);

  return <DisplayImage accessor={accessor} alt={altText} {...props} />;
};

export default ModelDisplayAttachmentImage;
