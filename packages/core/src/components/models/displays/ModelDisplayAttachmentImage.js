import { useCallback, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import DisplayImage from 'rhino/components/forms/displays/DisplayImage';

// eslint-disable-next-line no-unused-vars
const ModelDisplayAttachmentImage = ({ model, ...props }) => {
  const accessor = useCallback((value) => value?.url, []);
  const watch = useWatch({ name: props.path });

  const altText = useMemo(() => watch?.display_name, [watch]);

  return <DisplayImage accessor={accessor} alt={altText} {...props} />;
};

export default ModelDisplayAttachmentImage;
