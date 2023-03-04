import { useCallback, useMemo } from 'react';
import CellImage from 'rhino/components/table/cells/CellImage';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

const defaultComponents = {
  ModelCellAttachmentImage: CellImage
};

const ModelCellAttachmentImage = ({ overrides, model, getValue, ...props }) => {
  const { ModelCellAttachmentImage } = useGlobalOverrides(
    defaultComponents,
    overrides
  );

  const syntheticGetValue = useCallback(() => getValue()?.url, [getValue]);

  const altText = useMemo(() => getValue()?.display_name || getValue()?.url, [
    getValue
  ]);

  return (
    <ModelCellAttachmentImage
      alt={altText}
      getValue={syntheticGetValue}
      {...props}
    ></ModelCellAttachmentImage>
  );
};

export default ModelCellAttachmentImage;
