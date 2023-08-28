import { useCallback, useMemo } from 'react';
import { useGlobalComponent } from 'rhino/hooks/overrides';
import CellLink from 'rhino/components/table/cells/CellLink';

export const ModelCellAttachmentDownloadBase = ({
  children,
  getValue,
  ...props
}) => {
  const syntheticGetValue = useCallback(() => getValue()?.url_attachment, [
    getValue
  ]);
  const linkText = useMemo(() => children || getValue()?.display_name, [
    children,
    getValue
  ]);

  return (
    <CellLink getValue={syntheticGetValue} {...props}>
      {linkText}
    </CellLink>
  );
};

const ModelCellAttachmentDownload = (props) =>
  useGlobalComponent(
    'ModelCellAttachmentDownload',
    ModelCellAttachmentDownloadBase,
    props
  );

export default ModelCellAttachmentDownload;
