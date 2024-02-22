import { useMemo } from 'react';
import { useGlobalComponent } from 'rhino/hooks/overrides';
import { useTableInheritedProps } from 'rhino/hooks/table';

export const CellImageBase = ({ empty = '-', ...props }) => {
  const { getValue, inheritedProps } = useTableInheritedProps(props);
  const src = useMemo(() => getValue(), [getValue]);

  if (!src) return <div {...inheritedProps}>{empty}</div>;

  return (
    <img
      alt={src}
      src={src}
      // Ensure image doesn't overflow table cell
      style={{ height: '50px', maxWidth: '100%' }}
      {...inheritedProps}
    />
  );
};

const CellImage = (props) =>
  useGlobalComponent('CellImage', CellImageBase, props);

export default CellImage;
