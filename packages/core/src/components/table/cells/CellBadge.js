import { Badge } from 'reactstrap';
import { useGlobalComponent } from '../../../hooks/overrides';
import { useTableInheritedProps } from '../../../hooks/table';

export const CellBadgeBase = ({ empty = '-', ...props }) => {
  const { getValue, inheritedProps } = useTableInheritedProps(props);

  if (!getValue()) return <div {...inheritedProps}>{empty}</div>;

  return <Badge {...inheritedProps}>{getValue()}</Badge>;
};

export const CellBadge = (props) =>
  useGlobalComponent('CellBadge', CellBadgeBase, props);
