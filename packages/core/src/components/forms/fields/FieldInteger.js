import { useGlobalComponent } from 'rhino/hooks/overrides';
import { FieldInputBase } from './FieldInput';

// We want it to be blank if it's not a number
const setValueAs = (value) => {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) return null;

  return parsed;
};

export const FieldIntegerBase = (props) => (
  <FieldInputBase type="number" setValueAs={setValueAs} {...props} />
);

const FieldInteger = (props) =>
  useGlobalComponent('FieldInteger', FieldIntegerBase, props);

export default FieldInteger;
