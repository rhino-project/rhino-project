import {
  useGlobalComponentForAttribute,
  useOverrides
} from 'rhino/hooks/overrides';
import { useModelContext } from 'rhino/hooks/models';
import {
  getModelAndAttributeFromPath,
  getModelFromRef,
  isOwnerGlobal
} from 'rhino/utils/models';
import ModelFieldGroupArrayInteger from './fieldGroups/ModelFieldGroupArrayInteger';
import ModelFieldGroupArrayString from './fieldGroups/ModelFieldGroupArrayString';
import ModelFieldGroupBoolean from './fieldGroups/ModelFieldGroupBoolean';
import ModelFieldGroupCountry from './fieldGroups/ModelFieldGroupCountry';
import ModelFieldGroupCurrency from './fieldGroups/ModelFieldGroupCurrency';
import ModelFieldGroupDate from './fieldGroups/ModelFieldGroupDate';
import ModelFieldGroupDateTime from './fieldGroups/ModelFieldGroupDateTime';
import ModelFieldGroupEnum from './fieldGroups/ModelFieldGroupEnum';
import ModelFieldGroupFile from './fieldGroups/ModelFieldGroupFile';
import ModelFieldGroupFloat from './fieldGroups/ModelFieldGroupFloat';
import ModelFieldGroupInteger from './fieldGroups/ModelFieldGroupInteger';
import ModelFieldGroupIntegerSelect from './fieldGroups/ModelFieldGroupIntegerSelect';
import ModelFieldGroupJoinSimple from './fieldGroups/ModelFieldGroupJoinSimple';
import ModelFieldGroupOwnerReference from './fieldGroups/ModelFieldGroupOwnerReference';
import ModelFieldGroupPhone from './fieldGroups/ModelFieldGroupPhone';
import ModelFieldGroupReference from './fieldGroups/ModelFieldGroupReference';
import ModelFieldGroupString from './fieldGroups/ModelFieldGroupString';
import ModelFieldGroupText from './fieldGroups/ModelFieldGroupText';
import ModelFieldGroupTime from './fieldGroups/ModelFieldGroupTime';
import ModelFieldGroupYear from './fieldGroups/ModelFieldGroupYear';
import ModelFieldGroupNested from './fieldGroups/ModelFieldGroupNested';

const defaultComponents = {
  ModelFieldGroupArrayInteger,
  ModelFieldGroupArrayString,
  ModelFieldGroupBoolean,
  ModelFieldGroupCountry,
  ModelFieldGroupCurrency,
  ModelFieldGroupDate,
  ModelFieldGroupDateTime,
  ModelFieldGroupEnum,
  ModelFieldGroupFile,
  ModelFieldGroupFloat,
  ModelFieldGroupInteger,
  ModelFieldGroupIntegerSelect,
  ModelFieldGroupJoinSimple,
  ModelFieldGroupOwnerReference,
  ModelFieldGroupPhone,
  ModelFieldGroupReference,
  ModelFieldGroupString,
  ModelFieldGroupText,
  ModelFieldGroupTime,
  ModelFieldGroupYear
};

export const ModelFieldGroupBase = ({ overrides, ...originalProps }) => {
  const {
    ModelFieldGroupArrayInteger,
    ModelFieldGroupArrayString,
    ModelFieldGroupBoolean,
    ModelFieldGroupCountry,
    ModelFieldGroupCurrency,
    ModelFieldGroupDate,
    ModelFieldGroupDateTime,
    ModelFieldGroupEnum,
    ModelFieldGroupFile,
    ModelFieldGroupFloat,
    ModelFieldGroupInteger,
    ModelFieldGroupIntegerSelect,
    ModelFieldGroupJoinSimple,
    ModelFieldGroupOwnerReference,
    ModelFieldGroupPhone,
    ModelFieldGroupReference,
    ModelFieldGroupString,
    ModelFieldGroupText,
    ModelFieldGroupTime,
    ModelFieldGroupYear
  } = useOverrides(defaultComponents, overrides);
  const { model } = useModelContext();
  const { path } = originalProps;
  // FIXME: This should be solved in a better way with a FieldGroup context
  const props = { model, ...originalProps };

  const [, attribute] = getModelAndAttributeFromPath(model, path);

  switch (attribute.type) {
    case 'array':
      if (attribute?.items?.type === 'string') {
        return <ModelFieldGroupArrayString {...props} />;
      } else if (attribute?.items?.type === 'integer') {
        return <ModelFieldGroupArrayInteger {...props} />;
      } else if (
        attribute?.items?.anyOf?.[0]?.['$ref']?.endsWith('_attachment')
      ) {
        return <ModelFieldGroupFile multiple {...props} />;
      } else {
        if (attribute.format === 'join_table_simple') {
          return <ModelFieldGroupJoinSimple {...props} />;
        }
      }

      return <ModelFieldGroupNested {...props} />;
    case 'reference':
      // eslint-disable-next-line no-case-declarations
      const refModel = getModelFromRef(attribute);

      if (path.endsWith('_attachment'))
        return <ModelFieldGroupFile {...props} />;

      if (isOwnerGlobal(refModel))
        return <ModelFieldGroupReference {...props} />;

      return <ModelFieldGroupOwnerReference {...props} />;

    case 'boolean':
      return <ModelFieldGroupBoolean {...props} />;
    case 'integer':
      switch (attribute.format) {
        case 'year':
          return <ModelFieldGroupYear {...props} />;
        case 'select':
          return <ModelFieldGroupIntegerSelect {...props} />;
        default:
          return <ModelFieldGroupInteger {...props} />;
      }
    case 'decimal':
    case 'float':
    case 'number':
      if (attribute.format === 'currency')
        return <ModelFieldGroupCurrency {...props} />;

      return <ModelFieldGroupFloat {...props} />;
    case 'text':
      return <ModelFieldGroupText {...props} />;
    case 'string':
      if (attribute.enum) {
        return <ModelFieldGroupEnum {...props} />;
      }

      switch (attribute.format) {
        case 'date':
          return <ModelFieldGroupDate {...props} />;
        case 'datetime':
          return <ModelFieldGroupDateTime {...props} />;
        case 'time':
          return <ModelFieldGroupTime {...props} />;
        case 'phone':
          return <ModelFieldGroupPhone {...props} />;
        case 'country':
          return <ModelFieldGroupCountry {...props} />;
        default:
          return <ModelFieldGroupString {...props} />;
      }

    default:
      console.assert(false, 'No available field for ', attribute);
  }

  return 'No field for this attribute type';
};

const ModelFieldGroup = (props) =>
  useGlobalComponentForAttribute('ModelFieldGroup', ModelFieldGroupBase, props);

export default ModelFieldGroup;
