import { useCallback } from 'react';
import CellString from 'rhino/components/table/cells/CellString';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

const defaultComponents = {
  ModelCellArray: CellString
};

const ModelCellArray = ({ overrides, getValue, ...props }) => {
  const { ModelCellArray } = useGlobalOverrides(defaultComponents, overrides);

  const syntheticGetValue = useCallback(() => getValue()?.join(', '), [
    getValue
  ]);

  return (
    <ModelCellArray getValue={syntheticGetValue} {...props}></ModelCellArray>
  );
};

export default ModelCellArray;
