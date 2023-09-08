import { useCallback, useMemo } from 'react';
import { useGlobalComponent } from 'rhino/hooks/overrides';
import CellLink from 'rhino/components/table/cells/CellLink';

export const ModelCellAttachmentBase = ({ children, getValue, ...props }) => {
  const syntheticGetValue = useCallback(() => getValue()?.url, [getValue]);
  const linkText = useMemo(
    () => children || getValue()?.display_name,
    [children, getValue]
  );

  return (
    <CellLink getValue={syntheticGetValue} {...props}>
      {linkText}
    </CellLink>
  );
};

const ModelCellAttachment = (props) =>
  useGlobalComponent('ModelCellAttachment', ModelCellAttachmentBase, props);

export default ModelCellAttachment;
