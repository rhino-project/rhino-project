import { useGlobalComponent } from '../../../hooks/overrides';
import { FieldInputBase } from './FieldInput';

// We want it to be blank if it's not a number
const setValueAs = (value) => {
  const parsed = parseFloat(value, 10);
  if (isNaN(parsed)) return null;

  return parsed;
};

export const FieldFloatBase = (props) => (
  <FieldInputBase type="number" setValueAs={setValueAs} {...props} />
);

export const FieldFloat = (props) =>
  useGlobalComponent('FieldFloat', FieldFloatBase, props);
