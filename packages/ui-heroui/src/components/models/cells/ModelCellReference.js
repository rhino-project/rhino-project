import { useCallback } from 'react';
import { useGlobalComponentForAttribute } from '@rhino-project/core/hooks';
import { CellString } from '../../table/cells/CellString';

export const ModelCellReferenceBase = ({ getValue, ...props }) => {
  const syntheticGetValue = useCallback(
    () => getValue()?.display_name,
    [getValue]
  );

  return <CellString getValue={syntheticGetValue} {...props}></CellString>;
};

export const ModelCellReference = (props) =>
  useGlobalComponentForAttribute(
    'ModelCellReference',
    ModelCellReferenceBase,
    props
  );
