import { useCallback } from 'react';
import { useGlobalOverrides } from 'rhino/hooks/overrides';
import CellString from 'rhino/components/table/cells/CellString';

export const ModelCellArrayBase = ({ getValue, ...props }) => {
  const syntheticGetValue = useCallback(() => getValue()?.join(', '), [
    getValue
  ]);

  return <CellString getValue={syntheticGetValue} {...props} />;
};

const defaultComponents = { ModelCellArray: ModelCellArrayBase };

const ModelCellArray = ({ overrides, ...props }) => {
  const { ModelCellArray } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );
  return <ModelCellArray {...props}></ModelCellArray>;
};

export default ModelCellArray;
