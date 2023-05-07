import { useCallback } from 'react';
import { useGlobalOverrides } from 'rhino/hooks/overrides';
import CellString from 'rhino/components/table/cells/CellString';
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

const defaultComponents = {
  ModelCellArrayReference: ModelCellArrayReferenceBase
};

const ModelCellArrayReference = ({ overrides, ...props }) => {
  const { ModelCellArrayReference } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelCellArrayReference {...props} />;
};

export default ModelCellArrayReference;
