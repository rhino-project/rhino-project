import { Flag } from 'rhino/components/models/fields/ModelFieldCountry';

const CellCountry = ({ getValue, empty = '-' }) => {
  if (!getValue()) return empty;

  return <Flag country={getValue()} />;
};

export default CellCountry;
