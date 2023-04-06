import { useCallback } from 'react';
import { useGlobalOverrides } from 'rhino/hooks/overrides';
import CellString from 'rhino/components/table/cells/CellString';

export const ModelCellArrayReferenceBase = ({ getValue, ...props }) => {
  const syntheticGetValue = useCallback(
    () =>
      getValue()
        ?.map((v) => v.display_name)
        ?.join(', '),
    [getValue]
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
