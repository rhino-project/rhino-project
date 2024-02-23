import {
  useGlobalComponentForAttribute,
  useOverrides
} from '../../hooks/overrides';
import {
  useModelAndAttributeFromPath,
  useModelContext
} from '../../hooks/models';

import { ModelDisplayGroupArray } from './displayGroups/ModelDisplayGroupArray';
import { ModelDisplayGroupArrayReference } from './displayGroups/ModelDisplayGroupArrayReference';
import { ModelDisplayGroupAttachment } from './displayGroups/ModelDisplayGroupAttachment';
import { ModelDisplayGroupAttachmentImage } from './displayGroups/ModelDisplayGroupAttachmentImage';
import { ModelDisplayGroupAttachments } from './displayGroups/ModelDisplayGroupAttachments';
import { ModelDisplayGroupBoolean } from './displayGroups/ModelDisplayGroupBoolean';
import { ModelDisplayGroupCurrency } from './displayGroups/ModelDisplayGroupCurrency';
import { ModelDisplayGroupDate } from './displayGroups/ModelDisplayGroupDate';
import { ModelDisplayGroupDateTime } from './displayGroups/ModelDisplayGroupDateTime';
import { ModelDisplayGroupEnum } from './displayGroups/ModelDisplayGroupEnum';
import { ModelDisplayGroupFloat } from './displayGroups/ModelDisplayGroupFloat';
import { ModelDisplayGroupInteger } from './displayGroups/ModelDisplayGroupInteger';
import { ModelDisplayGroupReference } from './displayGroups/ModelDisplayGroupReference';
import { ModelDisplayGroupString } from './displayGroups/ModelDisplayGroupString';
import { ModelDisplayGroupText } from './displayGroups/ModelDisplayGroupText';
import { ModelDisplayGroupTime } from './displayGroups/ModelDisplayGroupTime';

const defaultComponents = {
  ModelDisplayGroupArray,
  ModelDisplayGroupArrayReference,
  ModelDisplayGroupAttachment,
  ModelDisplayGroupAttachmentImage,
  ModelDisplayGroupAttachments,
  ModelDisplayGroupBoolean,
  ModelDisplayGroupCurrency,
  ModelDisplayGroupDate,
  ModelDisplayGroupDateTime,
  ModelDisplayGroupEnum,
  ModelDisplayGroupFloat,
  ModelDisplayGroupInteger,
  ModelDisplayGroupReference,
  ModelDisplayGroupString,
  ModelDisplayGroupText,
  ModelDisplayGroupTime
};

export const ModelDisplayGroupBase = ({ overrides, ...originalProps }) => {
  const {
    ModelDisplayGroupArray,
    ModelDisplayGroupArrayReference,
    ModelDisplayGroupAttachment,
    ModelDisplayGroupAttachmentImage,
    ModelDisplayGroupAttachments,
    ModelDisplayGroupBoolean,
    ModelDisplayGroupCurrency,
    ModelDisplayGroupDate,
    ModelDisplayGroupDateTime,
    ModelDisplayGroupEnum,
    ModelDisplayGroupFloat,
    ModelDisplayGroupInteger,
    ModelDisplayGroupReference,
    ModelDisplayGroupString,
    ModelDisplayGroupText,
    ModelDisplayGroupTime
  } = useOverrides(defaultComponents, overrides);
  const { model } = useModelContext();
  const { path } = originalProps;
  // FIXME: This should be solved in a better way with a DisplayGroup context
  const props = { model, ...originalProps };
  const { attribute } = useModelAndAttributeFromPath(model, path);

  // FIXME: Make this a separate function so that its easier to override
  switch (attribute?.type) {
    case 'array':
      switch (attribute.items?.type) {
        case 'string':
        case 'integer':
          return <ModelDisplayGroupArray {...props} />;
        default:
          if (
            attribute?.items?.anyOf?.[0]?.['$ref'] ===
            '#/components/schemas/active_storage_attachment'
          ) {
            return <ModelDisplayGroupAttachments {...props} />;
          }
          return <ModelDisplayGroupArrayReference {...props} />;
      }
    case 'boolean':
      return <ModelDisplayGroupBoolean {...props} />;
    case 'identifier':
    case 'integer':
      return <ModelDisplayGroupInteger {...props} />;
    case 'decimal':
    case 'number':
    case 'float':
      if (attribute.format === 'currency')
        return <ModelDisplayGroupCurrency {...props} />;
      return <ModelDisplayGroupFloat {...props} />;

    case 'reference':
      if (attribute.name.endsWith('_attachment')) {
        if (attribute.format === 'image') {
          return <ModelDisplayGroupAttachmentImage {...props} />;
        } else {
          return <ModelDisplayGroupAttachment {...props} />;
        }
      }
      return <ModelDisplayGroupReference {...props} />;
    case 'string':
      if (attribute?.enum) return <ModelDisplayGroupEnum {...props} />;

      switch (attribute.format) {
        case 'date':
          return <ModelDisplayGroupDate {...props} />;
        case 'time':
          return <ModelDisplayGroupTime {...props} />;
        case 'datetime':
          return <ModelDisplayGroupDateTime {...props} />;
        default:
          return <ModelDisplayGroupString {...props} />;
      }
    case 'text':
      return <ModelDisplayGroupText {...props} />;
    default:
      console.assert(false, 'No available display for ', attribute);
  }

  return 'No Display for this attribute type';
};

export const ModelDisplayGroup = (props) =>
  useGlobalComponentForAttribute(
    'ModelDisplayGroup',
    ModelDisplayGroupBase,
    props
  );
