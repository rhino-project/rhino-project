const CellString = ({ getValue, empty = '-' }) => {
  return getValue() || empty;
};

export default CellString;
