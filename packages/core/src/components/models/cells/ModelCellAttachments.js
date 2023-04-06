import { useCallback } from 'react';
import { useGlobalOverrides } from 'rhino/hooks/overrides';
import CellString from 'rhino/components/table/cells/CellString';

export const ModelCellAttachmentsBase = ({ getValue, ...props }) => {
  const syntheticGetValue = useCallback(
    () => (getValue()?.length ? `${getValue()?.length} files` : undefined),
    [getValue]
  );

  return <CellString getValue={syntheticGetValue} {...props} />;
};

const defaultComponents = { ModelCellAttachments: ModelCellAttachmentsBase };

const ModelCellAttachments = ({ overrides, ...props }) => {
  const { ModelCellAttachments } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );
  return <ModelCellAttachments {...props} />;
};

export default ModelCellAttachments;
