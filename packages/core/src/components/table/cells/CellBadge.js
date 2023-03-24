import { Badge } from 'reactstrap';
import { useTableInheritedProps } from 'rhino/hooks/table';

const CellBadge = ({ getValue, empty = '-', ...props }) => {
  const { inheritedProps } = useTableInheritedProps(props);

  if (!getValue()) return empty;

  return <Badge {...inheritedProps}>{getValue()}</Badge>;
};

export default CellBadge;
