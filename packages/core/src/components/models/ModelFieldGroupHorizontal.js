import { ModelFieldGroupBase } from './ModelFieldGroup';
import FieldLayoutHorizontal from '../forms/FieldLayoutHorizontal';

const overrides = { ModelFieldLayout: FieldLayoutHorizontal };

export const ModelFieldGroupHorizontal = (props) => (
  <ModelFieldGroupBase overrides={overrides} {...props} />
);

export default ModelFieldGroupHorizontal;
