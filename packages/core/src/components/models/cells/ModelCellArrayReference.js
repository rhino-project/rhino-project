import { useCallback } from 'react';
import CellString from 'rhino/components/table/cells/CellString';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

const defaultComponents = {
  ModelCellArrayReference: CellString
};

const ModelCellArrayReference = ({ overrides, getValue, ...props }) => {
  const { ModelCellArrayReference } = useGlobalOverrides(
    defaultComponents,
    overrides
  );

  const syntheticGetValue = useCallback(
    () =>
      getValue()
        ?.map((v) => v.display_name)
        ?.join(', '),
    [getValue]
  );

  return (
    <ModelCellArrayReference
      getValue={syntheticGetValue}
      {...props}
    ></ModelCellArrayReference>
  );
};

export default ModelCellArrayReference;
