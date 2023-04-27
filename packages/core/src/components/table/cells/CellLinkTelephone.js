import { useCallback, useMemo } from 'react';
import { useTableInheritedProps } from 'rhino/hooks/table';
import CellLink from 'rhino/components/table/cells/CellLink';

const CellLinkTelephone = ({ children, empty = '-', ...props }) => {
  const { getValue, inheritedProps } = useTableInheritedProps(props);
  const syntheticGetValue = useCallback(
    () => `tel:${getValue()?.replace(/\D/g, '')}`,
    [getValue]
  );
  const linkText = useMemo(() => children || getValue(), [children, getValue]);

  if (!getValue()) {
    return <div {...inheritedProps}>{empty}</div>;
  }

  return (
    <CellLink {...props} getValue={syntheticGetValue}>
      {linkText}
    </CellLink>
  );
};

export default CellLinkTelephone;
