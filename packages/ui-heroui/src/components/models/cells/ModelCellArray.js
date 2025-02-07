import { useCallback } from 'react';
import { useGlobalComponentForAttribute } from '@rhino-project/core/hooks';
import { CellString } from '../../table/cells/CellString';

export const ModelCellArrayBase = ({ getValue, ...props }) => {
  const syntheticGetValue = useCallback(
    () => getValue()?.join(', '),
    [getValue]
  );

  return <CellString getValue={syntheticGetValue} {...props} />;
};

export const ModelCellArray = (props) =>
  useGlobalComponentForAttribute('ModelCellArray', ModelCellArrayBase, props);
