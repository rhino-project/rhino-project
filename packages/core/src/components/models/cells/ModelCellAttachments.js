import { useCallback } from 'react';
import { useGlobalComponent } from 'rhino/hooks/overrides';
import CellString from 'rhino/components/table/cells/CellString';

export const ModelCellAttachmentsBase = ({ getValue, ...props }) => {
  const syntheticGetValue = useCallback(
    () => (getValue()?.length ? `${getValue()?.length} files` : undefined),
    [getValue]
  );

  return <CellString getValue={syntheticGetValue} {...props} />;
};

const ModelCellAttachments = (props) =>
  useGlobalComponent('ModelCellAttachments', ModelCellAttachmentsBase, props);

export default ModelCellAttachments;
