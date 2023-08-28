import { useMemo } from 'react';
import { useTableInheritedProps } from 'rhino/hooks/table';

const CellImage = ({ empty = '-', ...props }) => {
  const { getValue, inheritedProps } = useTableInheritedProps(props);
  const src = useMemo(() => getValue(), [getValue]);

  if (!src) return <div {...inheritedProps}>{empty}</div>;

  return (
    <img
      alt={src}
      src={src}
      height="50"
      // Ensure image doesn't overflow table cell
      maxwidth="100%"
      {...inheritedProps}
    />
  );
};

export default CellImage;
