import { useCallback, useMemo } from 'react';
import { useGlobalOverrides } from 'rhino/hooks/overrides';
import CellLink from 'rhino/components/table/cells/CellLink';

export const ModelCellAttachmentBase = ({ children, getValue, ...props }) => {
  const syntheticGetValue = useCallback(() => getValue()?.url, [getValue]);
  const linkText = useMemo(() => children || getValue()?.display_name, [
    children,
    getValue
  ]);

  return (
    <CellLink getValue={syntheticGetValue} {...props}>
      {linkText}
    </CellLink>
  );
};

const defaultComponents = { ModelCellAttachment: ModelCellAttachmentBase };

const ModelCellAttachment = ({ overrides, ...props }) => {
  const { ModelCellAttachment } = useGlobalOverrides(
    defaultComponents,
    overrides,
    props
  );

  return <ModelCellAttachment {...props} />;
};

export default ModelCellAttachment;
