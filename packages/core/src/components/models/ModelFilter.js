import { useModel } from 'rhino/hooks/models';
import {
  getModelAndAttributeFromPath,
  getModelFromRef,
  isOwnerGlobal
} from 'rhino/utils/models';
import ModelFilterBoolean from './filters/ModelFilterBoolean';
import ModelFilterDate from './filters/ModelFilterDate';
import ModelFilterDateTime from './filters/ModelFilterDateTime';
import ModelFilterEnum from './filters/ModelFilterEnum';
import ModelFilterFloat from './filters/ModelFilterFloat';
import ModelFilterInteger from './filters/ModelFilterInteger';
import ModelFilterIntegerSelect from './filters/ModelFilterIntegerSelect';
import ModelFilterOwnerReference from './filters/ModelFilterOwnerReference';
import ModelFilterReference from './filters/ModelFilterReference';
import ModelFilterString from './filters/ModelFilterString';
import ModelFilterTime from './filters/ModelFilterTime';
import ModelFilterYear from './filters/ModelFilterYear';

export const ModelFilter = ({ overrides, ...props }) => {
  const model = useModel(props.model);
  const { path } = props;

  const [, attribute] = getModelAndAttributeFromPath(model, path);

  // FIXME: Make this a separate function so that its easier to override
  switch (attribute?.type) {
    case 'boolean':
      return <ModelFilterBoolean {...props} />;
    case 'integer':
      switch (attribute.format) {
        case 'year':
          return <ModelFilterYear {...props} />;
        case 'select':
          return <ModelFilterIntegerSelect {...props} />;
        default:
          return <ModelFilterInteger {...props} />;
      }
    case 'float':
      return <ModelFilterFloat {...props} />;

    case 'reference':
      const refModel = getModelFromRef(attribute);

      if (isOwnerGlobal(refModel)) return <ModelFilterReference {...props} />;

      return <ModelFilterOwnerReference {...props} />;
    case 'string':
      if (attribute?.enum) return <ModelFilterEnum {...props} />;

      switch (attribute.format) {
        case 'date':
          return <ModelFilterDate {...props} />;
        case 'time':
          return <ModelFilterTime {...props} />;
        case 'datetime':
          return <ModelFilterDateTime {...props} />;
        default:
          return <ModelFilterString {...props} />;
      }
    // eslint-disable-next-line no-fallthrough
    default:
      console.assert(false, 'No available filter for ', attribute);
  }

  return 'No filter for this attribute type';
};

export default ModelFilter;
