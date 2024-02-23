import FieldString from '../fields/FieldString';

const setValueAs = (value) => {
  if (value === '') return null;

  return value;
};

const FilterString = (props) => (
  <FieldString setValueAs={setValueAs} {...props} />
);

export default FilterString;
