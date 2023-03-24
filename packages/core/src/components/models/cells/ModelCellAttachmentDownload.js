import { useCallback, useMemo } from 'react';
import CellLink from 'rhino/components/table/cells/CellLink';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

const defaultComponents = {
  ModelCellAttachmentDownload: CellLink
};

const ModelCellAttachmentDownload = ({
  overrides,
  children,
  model,
  path,
  getValue,
  ...props
}) => {
  const { ModelCellAttachmentDownload } = useGlobalOverrides(
    defaultComponents,
    overrides
  );

  const syntheticGetValue = useCallback(() => getValue()?.url_attachment, [
    getValue
  ]);
  const linkText = useMemo(() => children || getValue()?.display_name, [
    children,
    getValue
  ]);

  return (
    <ModelCellAttachmentDownload getValue={syntheticGetValue} {...props}>
      {linkText}
    </ModelCellAttachmentDownload>
  );
};

export default ModelCellAttachmentDownload;
