import { useCallback, useMemo } from 'react';
import CellLink from 'rhino/components/table/cells/CellLink';
import { useGlobalOverrides } from 'rhino/hooks/overrides';

const defaultComponents = {
  ModelCellAttachment: CellLink
};

const ModelCellAttachment = ({
  overrides,
  children,
  model,
  path,
  getValue,
  ...props
}) => {
  const { ModelCellAttachment } = useGlobalOverrides(
    defaultComponents,
    overrides
  );

  const syntheticGetValue = useCallback(() => getValue()?.url, [getValue]);
  const linkText = useMemo(() => children || getValue()?.display_name, [
    children,
    getValue
  ]);

  return (
    <ModelCellAttachment getValue={syntheticGetValue} {...props}>
      {linkText}
    </ModelCellAttachment>
  );
};

export default ModelCellAttachment;
