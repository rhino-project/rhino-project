import { useMemo } from 'react';
import { useGlobalComponent } from 'rhino/hooks/overrides';
import { useTableInheritedProps } from 'rhino/hooks/table';

export const CellLinkBase = ({ children, empty = '-', ...props }) => {
  const { getValue, inheritedProps } = useTableInheritedProps(props);
  const linkText = useMemo(
    () => children || getValue() || empty,
    [children, empty, getValue]
  );

  if (!getValue()) return <div {...inheritedProps}>{empty}</div>;

  // Stop propogation of the click event so that the row click handling does not fire
  return (
    <a
      href={getValue()}
      onClick={(e) => e.stopPropagation()}
      {...inheritedProps}
    >
      {linkText}
    </a>
  );
};

const CellLink = (props) => useGlobalComponent('CellLink', CellLinkBase, props);

export default CellLink;
