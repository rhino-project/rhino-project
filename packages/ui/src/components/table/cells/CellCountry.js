import { Flag } from '../../forms/fields/FieldCountry';
import { useGlobalComponent } from '@rhino-project/core/hooks';
import { useTableInheritedProps } from '@rhino-project/core/hooks';

export const CellCountryBase = ({ empty = '-', ...props }) => {
  const { getValue, inheritedProps } = useTableInheritedProps(props);
  if (!getValue()) return <div {...inheritedProps}>{empty}</div>;

  return <Flag country={getValue()} {...inheritedProps} />;
};

export const CellCountry = (props) =>
  useGlobalComponent('CellCountry', CellCountryBase, props);
