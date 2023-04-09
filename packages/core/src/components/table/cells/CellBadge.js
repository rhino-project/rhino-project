import { Badge } from 'reactstrap';
import { useTableInheritedProps } from 'rhino/hooks/table';

const CellBadge = ({ empty = '-', ...props }) => {
  const { getValue, inheritedProps } = useTableInheritedProps(props);

  if (!getValue()) return <div {...inheritedProps}>{empty}</div>;

  return <Badge {...inheritedProps}>{getValue()}</Badge>;
};

export default CellBadge;
