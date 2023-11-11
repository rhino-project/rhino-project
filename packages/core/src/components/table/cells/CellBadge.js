import { Badge } from 'reactstrap';
import { useGlobalComponent } from 'rhino/hooks/overrides';
import { useTableInheritedProps } from 'rhino/hooks/table';

export const CellBadgeBase = ({ empty = '-', ...props }) => {
  const { getValue, inheritedProps } = useTableInheritedProps(props);

  if (!getValue()) return <div {...inheritedProps}>{empty}</div>;

  return <Badge {...inheritedProps}>{getValue()}</Badge>;
};

const CellBadge = (props) =>
  useGlobalComponent('CellBadge', CellBadgeBase, props);

export default CellBadge;
