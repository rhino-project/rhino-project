import FieldInputControlled from '../fields/FieldInputControlled';

const DisplayStringControlled = (props) => (
  <FieldInputControlled type="text" readOnly {...props} />
);

export default DisplayStringControlled;
