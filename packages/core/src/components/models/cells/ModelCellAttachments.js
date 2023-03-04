import { useCallback } from 'react';
import CellString from 'rhino/components/table/cells/CellString';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

const defaultComponents = {
  ModelCellAttachments: CellString
};

const ModelCellAttachments = ({ overrides, getValue, ...props }) => {
  const { ModelCellAttachments } = useGlobalOverrides(
    defaultComponents,
    overrides
  );

  const syntheticGetValue = useCallback(
    () => (getValue()?.length ? `${getValue()?.length} files` : undefined),
    [getValue]
  );

  return (
    <ModelCellAttachments
      getValue={syntheticGetValue}
      {...props}
    ></ModelCellAttachments>
  );
};

export default ModelCellAttachments;
