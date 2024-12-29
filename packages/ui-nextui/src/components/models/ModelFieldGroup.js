import {
  useGlobalComponentForAttribute,
  useOverrides
} from '@rhino-project/core/hooks';
import { useModelContext } from '@rhino-project/core/hooks';
import {
  getModelAndAttributeFromPath,
  getModelFromRef,
  isOwnerGlobal
} from '@rhino-project/core/utils';
import {
  ModelFieldBoolean,
  ModelFieldCurrency,
  ModelFieldCountry,
  ModelFieldDate,
  ModelFieldDateTime,
  ModelFieldEnum,
  ModelFieldFile,
  ModelFieldFloat,
  ModelFieldInteger,
  ModelFieldIntegerSelect,
  ModelFieldOwnerReference,
  ModelFieldPhone,
  ModelFieldReference,
  ModelFieldString,
  ModelFieldText,
  ModelFieldTime,
  ModelFieldYear
} from '../../ModelField';

const defaultComponents = {
  ModelFieldBoolean,
  ModelFieldCountry,
  ModelFieldCurrency,
  ModelFieldDate,
  ModelFieldDateTime,
  ModelFieldEnum,
  ModelFieldFile,
  ModelFieldFloat,
  ModelFieldInteger,
  ModelFieldIntegerSelect,
  ModelFieldOwnerReference,
  ModelFieldPhone,
  ModelFieldReference,
  ModelFieldString,
  ModelFieldText,
  ModelFieldTime,
  ModelFieldYear
};

export const ModelFieldGroupBase = ({ overrides, ...originalProps }) => {
  const {
    ModelFieldBoolean,
    ModelFieldCountry,
    ModelFieldCurrency,
    ModelFieldDate,
    ModelFieldDateTime,
    ModelFieldEnum,
    ModelFieldFile,
    ModelFieldFloat,
    ModelFieldInteger,
    ModelFieldIntegerSelect,
    ModelFieldGroupJoinSimple,
    ModelFieldOwnerReference,
    ModelFieldPhone,
    ModelFieldReference,
    ModelFieldString,
    ModelFieldText,
    ModelFieldTime,
    ModelFieldYear
  } = useOverrides(defaultComponents, overrides);
  const { model } = useModelContext();
  const { path } = originalProps;
  // FIXME: This should be solved in a better way with a FieldGroup context
  const props = { model, ...originalProps };

  const [, attribute] = getModelAndAttributeFromPath(model, path);

  switch (attribute.type) {
    case 'array':
      if (attribute?.items?.anyOf?.[0]?.['$ref']?.endsWith('_attachment')) {
        return <ModelFieldFile multiple {...props} />;
      }

      break;
    case 'reference':
      // eslint-disable-next-line no-case-declarations
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

export const ModelFieldGroup = (props) =>
  useGlobalComponentForAttribute('ModelFieldGroup', ModelFieldGroupBase, props);
