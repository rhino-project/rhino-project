import { useCallback } from 'react';
import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import CellString from '../../table/cells/CellString';

export const ModelCellReferenceBase = ({ getValue, ...props }) => {
  const syntheticGetValue = useCallback(
    () => getValue()?.display_name,
    [getValue]
  );

  return <CellString getValue={syntheticGetValue} {...props}></CellString>;
};

const ModelCellReference = (props) =>
  useGlobalComponentForAttribute(
    'ModelCellReference',
    ModelCellReferenceBase,
    props
  );

export default ModelCellReference;
