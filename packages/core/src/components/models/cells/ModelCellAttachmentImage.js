import { useCallback, useMemo } from 'react';
import { useGlobalOverrides } from 'rhino/hooks/overrides';
import CellImage from 'rhino/components/table/cells/CellImage';

export const ModelCellAttachmentImageBase = ({ getValue, ...props }) => {
  const syntheticGetValue = useCallback(() => getValue()?.url, [getValue]);

  const altText = useMemo(() => getValue()?.display_name || getValue()?.url, [
    getValue
  ]);

  return <CellImage alt={altText} getValue={syntheticGetValue} {...props} />;
};

const defaultComponents = {
  ModelCellAttachmentImage: ModelCellAttachmentImageBase
};

const ModelCellAttachmentImage = ({ overrides, ...props }) => {
  const { ModelCellAttachmentImage } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelCellAttachmentImage {...props} />;
};

export default ModelCellAttachmentImage;
