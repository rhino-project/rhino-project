import { useCallback, useMemo } from 'react';
import { useTableInheritedProps } from 'rhino/hooks/table';
import CellLink from 'rhino/components/table/cells/CellLink';

const CellLinkEmail = ({ children, empty = '-', ...props }) => {
  const { getValue, inheritedProps } = useTableInheritedProps(props);
  const syntheticGetValue = useCallback(
    () => `mailto:${getValue()?.replace(/ /g, '')}`,
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

export default CellLinkEmail;
