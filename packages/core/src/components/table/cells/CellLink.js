import { useMemo } from 'react';

const CellLink = ({ children, getValue, empty = '-', ...props }) => {
  const linkText = useMemo(() => children || getValue() || empty, [
    children,
    empty,
    getValue
  ]);

  if (!getValue()) return empty;

  // Stop propogation of the click event so that the row click handling does not fire
  return (
    <a href={getValue()} onClick={(e) => e.stopPropagation()}>
      {linkText}
    </a>
  );
};

export default CellLink;
