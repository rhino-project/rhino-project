import { useGlobalComponent } from 'rhino/hooks/overrides';
import { DisplayStringBase } from './DisplayString';

export const DisplayEnumBase = (props) => {
  return <DisplayStringBase {...props} />;
};

const DisplayEnum = (props) =>
  useGlobalComponent('DisplayEnum', DisplayEnumBase, props);

export default DisplayEnum;
