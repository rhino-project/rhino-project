import { FlagImage } from 'react-international-phone';
import { useGlobalComponent } from '@rhino-project/core/hooks';
import { useTableInheritedProps } from '@rhino-project/core/hooks';

export const CellCountryBase = ({ empty = '-', ...props }) => {
  const { getValue, inheritedProps } = useTableInheritedProps(props);
  const baseValue = getValue();

  if (!baseValue) return <div {...inheritedProps}>{empty}</div>;

  return (
    <FlagImage iso2={baseValue.toLowerCase()} size={24} {...inheritedProps} />
  );
};

export const CellCountry = (props) =>
  useGlobalComponent('CellCountry', CellCountryBase, props);
