import { Flag } from 'rhino/components/forms/fields/FieldCountry';
import { useGlobalComponent } from 'rhino/hooks/overrides';
import { useTableInheritedProps } from 'rhino/hooks/table';

export const CellCountryBase = ({ empty = '-', ...props }) => {
  const { getValue, inheritedProps } = useTableInheritedProps(props);
  if (!getValue()) return <div {...inheritedProps}>{empty}</div>;

  return <Flag country={getValue()} {...inheritedProps} />;
};

const CellCountry = (props) =>
  useGlobalComponent('CellCountry', CellCountryBase, props);

export default CellCountry;
