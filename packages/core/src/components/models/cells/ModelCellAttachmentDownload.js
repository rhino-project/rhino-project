import { useCallback, useMemo } from 'react';
import { useGlobalOverrides } from 'rhino/hooks/overrides';
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

const defaultComponents = {
  ModelCellAttachmentDownload: ModelCellAttachmentDownloadBase
};

const ModelCellAttachmentDownload = ({ overrides, ...props }) => {
  const { ModelCellAttachmentDownload } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelCellAttachmentDownload {...props} />;
};

export default ModelCellAttachmentDownload;
