import { useCallback } from 'react';
import CellString from 'rhino/components/table/cells/CellString';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

const defaultComponents = {
  ModelCellReference: CellString
};

const ModelCellReference = ({ overrides, model, path, getValue, ...props }) => {
  const { ModelCellReference } = useGlobalOverrides(
    defaultComponents,
    overrides
  );

  const syntheticGetValue = useCallback(() => getValue()?.display_name, [
    getValue
  ]);

  return (
    <ModelCellReference
      {...props}
      getValue={syntheticGetValue}
    ></ModelCellReference>
  );
};

export default ModelCellReference;
