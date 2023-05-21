import { useModel } from 'rhino/hooks/models';
import {
  getModelAndAttributeFromPath,
  getModelFromRef,
  isOwnerGlobal
} from 'rhino/utils/models';
import ModelFieldString from './fields/ModelFieldString';
import ModelFieldDateTime from './fields/ModelFieldDateTime';
import ModelFieldDate from './fields/ModelFieldDate';
import ModelFieldTime from './fields/ModelFieldTime';
import ModelFieldInteger from './fields/ModelFieldInteger';
import ModelFieldFloat from './fields/ModelFieldFloat';
import ModelFieldYear from './fields/ModelFieldYear';
import ModelFieldBoolean from './fields/ModelFieldBoolean';
import ModelFieldEnum from './fields/ModelFieldEnum';
import ModelFieldPhone from './fields/ModelFieldPhone';
import ModelFieldText from './fields/ModelFieldText';
import ModelFieldReference from './fields/ModelFieldReference';
import ModelFieldFile from './fields/ModelFieldFile';
import ModelFieldJoinSimple from './fields/ModelFieldJoinSimple';
import ModelFieldArrayInteger from './fields/ModelFieldArrayInteger';
import ModelFieldArrayString from './fields/ModelFieldArrayString';
import ModelFieldCountry from './fields/ModelFieldCountry';
import ModelFieldCurrency from './fields/ModelFieldCurrency';
import ModelFieldIntegerSelect from './fields/ModelFieldIntegerSelect';
import ModelFieldNested from './fields/ModelFieldNested';
import ModelFieldOwnerReference from './fields/ModelFieldOwnerReference';
import { useGlobalComponent } from 'rhino/hooks/overrides';

export const ModelFieldBase = ({ overrides, ...props }) => {
  const model = useModel(props.model);
  const { path } = props;

  const [, attribute] = getModelAndAttributeFromPath(model, path);

  switch (attribute.type) {
    case 'array':
      if (attribute?.items?.type === 'string') {
        return <ModelFieldArrayString {...props} />;
      } else if (attribute?.items?.type === 'integer') {
        return <ModelFieldArrayInteger {...props} />;
      } else if (
        attribute?.items?.anyOf?.[0]?.['$ref']?.endsWith('_attachment')
      ) {
        return <ModelFieldFile multiple {...props} />;
      } else {
        if (attribute.format === 'join_table_simple') {
          return <ModelFieldJoinSimple {...props} />;
        }

        return <ModelFieldNested {...props} />;
      }
    case 'reference':
      const refModel = getModelFromRef(attribute);

      if (path.endsWith('_attachment')) return <ModelFieldFile {...props} />;

      if (isOwnerGlobal(refModel)) return <ModelFieldReference {...props} />;

      return <ModelFieldOwnerReference {...props} />;
    case 'boolean':
      return <ModelFieldBoolean {...props} />;
    case 'integer':
      switch (attribute.format) {
        case 'year':
          return <ModelFieldYear {...props} />;
        case 'select':
          return <ModelFieldIntegerSelect {...props} />;
        default:
          return <ModelFieldInteger {...props} />;
      }
    case 'decimal':
    case 'float':
    case 'number':
      if (attribute.format === 'currency')
        return <ModelFieldCurrency {...props} />;

      return <ModelFieldFloat {...props} />;
    case 'text':
      return <ModelFieldText {...props} />;

    case 'string':
      if (attribute.enum) {
        return <ModelFieldEnum {...props} />;
      }

      switch (attribute.format) {
        case 'date':
          return <ModelFieldDate {...props} />;
        case 'datetime':
          return <ModelFieldDateTime {...props} />;
        case 'time':
          return <ModelFieldTime {...props} />;
        case 'phone':
          return <ModelFieldPhone {...props} />;
        case 'country':
          return <ModelFieldCountry {...props} />;
        default:
          return <ModelFieldString {...props} />;
      }

    default:
      console.assert(false, 'No available field for ', attribute);
  }

  return 'No field for this attribute type';
};

const ModelField = (props) => useGlobalComponent(ModelFieldBase, props);

export default ModelField;
