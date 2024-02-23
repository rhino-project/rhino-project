import { useCallback } from 'react';
import { useGlobalComponentForAttribute } from '../../../hooks/overrides';
import CellString from '../../table/cells/CellString';
import { isFunction } from 'lodash';

export const ModelCellArrayReferenceBase = ({
  getValue,
  accessor = 'display_name',
  ...props
}) => {
  const syntheticGetValue = useCallback(
    () =>
      getValue()
        ?.map((v) =>
          isFunction(accessor) ? accessor(getValue()) : v[accessor]
        )
        ?.join(', '),
    [accessor, getValue]
  );

  return <CellString getValue={syntheticGetValue} {...props} />;
};

const ModelCellArrayReference = (props) =>
  useGlobalComponentForAttribute(
    'ModelCellArrayReference',
    ModelCellArrayReferenceBase,
    props
  );

export default ModelCellArrayReference;
