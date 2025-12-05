import { Chip } from '@heroui/react';
import { useGlobalComponent } from '@rhino-project/core/hooks';
import { useTableInheritedProps } from '@rhino-project/core/hooks';

export const CellBadgeBase = ({ empty = '-', ...props }) => {
  const { getValue, inheritedProps } = useTableInheritedProps(props);

  if (!getValue()) return <div {...inheritedProps}>{empty}</div>;

  return <Chip {...inheritedProps}>{getValue()}</Chip>;
};

export const CellBadge = (props) =>
  useGlobalComponent('CellBadge', CellBadgeBase, props);
