import { Flag } from 'rhino/components/models/fields/ModelFieldCountry';
import { useTableInheritedProps } from 'rhino/hooks/table';

const CellCountry = ({ empty = '-', ...props }) => {
  const { getValue, inheritedProps } = useTableInheritedProps(props);
  if (!getValue()) return <div {...inheritedProps}>{empty}</div>;

  return <Flag country={getValue()} {...inheritedProps} />;
};

export default CellCountry;
