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
import ModelFilterTime from './filters/ModelFilterTime';
import ModelFilterYear from './filters/ModelFilterYear';

export const ModelFilter = ({ overrides, ...props }) => {
  const { model, path } = props;

  const [, attribute] = getModelAndAttributeFromPath(model, path);
  const refModel = getModelFromRef(attribute);

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
          console.assert(false, 'No available filter for ', attribute);
      }
    // eslint-disable-next-line no-fallthrough
    default:
      console.assert(false, 'No available filter for ', attribute);
  }

  return 'No filter for this attribute type';
};

export default ModelFilter;
