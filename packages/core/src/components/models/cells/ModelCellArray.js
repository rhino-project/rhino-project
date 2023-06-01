import { useCallback } from 'react';
import { useGlobalComponent } from 'rhino/hooks/overrides';
import CellString from 'rhino/components/table/cells/CellString';

export const ModelCellArrayBase = ({ getValue, ...props }) => {
  const syntheticGetValue = useCallback(() => getValue()?.join(', '), [
    getValue
  ]);

  return <CellString getValue={syntheticGetValue} {...props} />;
};

const ModelCellArray = (props) =>
  useGlobalComponent('ModelCellArray', ModelCellArrayBase, props);

export default ModelCellArray;
