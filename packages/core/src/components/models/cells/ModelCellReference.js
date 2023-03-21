import { useCallback } from 'react';
import { useGlobalOverrides } from 'rhino/hooks/overrides';
import CellString from 'rhino/components/table/cells/CellString';

export const ModelCellReferenceBase = ({ getValue, ...props }) => {
  const syntheticGetValue = useCallback(() => getValue()?.display_name, [
    getValue
  ]);

  return <CellString getValue={syntheticGetValue} {...props}></CellString>;
};

const defaultComponents = { ModelCellReference: ModelCellReferenceBase };

const ModelCellReference = ({ overrides, ...props }) => {
  const { ModelCellReference } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );
  return <ModelCellReference {...props} />;
};

export default ModelCellReference;
