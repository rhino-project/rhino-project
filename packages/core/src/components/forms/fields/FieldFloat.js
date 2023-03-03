import FieldInput from './FieldInput';

// We want it to be blank if it's not a number
const setValueAs = (value) => {
  const parsed = parseFloat(value, 10);
  if (isNaN(parsed)) return undefined;

  return parsed;
};

export const FieldInteger = (props) => (
  <FieldInput type="number" setValueAs={setValueAs} {...props} />
);

export default FieldInteger;
