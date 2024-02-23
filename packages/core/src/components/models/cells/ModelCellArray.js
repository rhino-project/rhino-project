import { useCallback } from 'react';
import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import CellString from '../../table/cells/CellString';

export const ModelCellArrayBase = ({ getValue, ...props }) => {
  const syntheticGetValue = useCallback(
    () => getValue()?.join(', '),
    [getValue]
  );

  return <CellString getValue={syntheticGetValue} {...props} />;
};

const ModelCellArray = (props) =>
  useGlobalComponentForAttribute('ModelCellArray', ModelCellArrayBase, props);

export default ModelCellArray;
