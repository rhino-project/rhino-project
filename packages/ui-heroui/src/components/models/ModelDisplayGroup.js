import {
  useGlobalComponentForAttribute,
  useOverrides,
  useModelAndAttributeFromPath,
  useModelContext
} from '@rhino-project/core/hooks';

import {
  ModelDisplayAttachment,
  ModelDisplayAttachmentImage,
  ModelDisplayAttachments,
  ModelDisplayArray,
  ModelDisplayArrayReference,
  ModelDisplayBoolean,
  ModelDisplayCurrency,
  ModelDisplayDate,
  ModelDisplayDateTime,
  ModelDisplayEnum,
  ModelDisplayFloat,
  ModelDisplayInteger,
  ModelDisplayReference,
  ModelDisplayString,
  ModelDisplayText,
  ModelDisplayTime,
  ModelDisplayYear
} from '../../ModelDisplay';

const defaultComponents = {
  ModelDisplayArray,
  ModelDisplayArrayReference,
  ModelDisplayAttachment,
  ModelDisplayAttachmentImage,
  ModelDisplayAttachments,
  ModelDisplayBoolean,
  ModelDisplayCurrency,
  ModelDisplayDate,
  ModelDisplayDateTime,
  ModelDisplayEnum,
  ModelDisplayFloat,
  ModelDisplayInteger,
  ModelDisplayReference,
  ModelDisplayString,
  ModelDisplayText,
  ModelDisplayTime
};

export const ModelDisplayGroupBase = ({ overrides, ...props }) => {
  const {
    ModelDisplayArray,
    ModelDisplayArrayReference,
    ModelDisplayAttachment,
    ModelDisplayAttachmentImage,
    ModelDisplayAttachments,
    ModelDisplayBoolean,
    ModelDisplayCurrency,
    ModelDisplayDate,
    ModelDisplayDateTime,
    ModelDisplayEnum,
    ModelDisplayFloat,
    ModelDisplayInteger,
    ModelDisplayReference,
    ModelDisplayString,
    ModelDisplayText,
    ModelDisplayTime
  } = useOverrides(defaultComponents, overrides);
  const { model } = useModelContext();
  const { path } = props;
  const { attribute } = useModelAndAttributeFromPath(model, path);

  // FIXME: Make this a separate function so that its easier to override
  switch (attribute?.type) {
    case 'array':
      switch (attribute.items?.type) {
        case 'string':
        case 'integer':
          return <ModelDisplayArray {...props} />;
        default:
          if (
            attribute?.items?.anyOf?.[0]?.['$ref'] ===
            '#/components/schemas/active_storage_attachment'
          ) {
            return <ModelDisplayAttachments {...props} />;
          }
          return <ModelDisplayArrayReference {...props} />;
      }
    case 'boolean':
      return <ModelDisplayBoolean {...props} />;
    case 'integer':
      switch (attribute.format) {
        case 'year':
          return <ModelDisplayYear {...props} />;
        default:
          return <ModelDisplayInteger {...props} />;
      }
    case 'decimal':
    case 'number':
      if (attribute.format === 'currency')
        return <ModelDisplayCurrency {...props} />;

      return <ModelDisplayFloat {...props} />;

    case 'reference':
      if (attribute.name.endsWith('_attachment')) {
        if (attribute.format === 'image') {
          return <ModelDisplayAttachmentImage {...props} />;
        } else {
          return <ModelDisplayAttachment {...props} />;
        }
      }
      return <ModelDisplayReference {...props} />;
    case 'string':
      if (attribute?.enum) return <ModelDisplayEnum {...props} />;

      switch (attribute.format) {
        case 'date':
          return <ModelDisplayDate {...props} />;
        case 'time':
          return <ModelDisplayTime {...props} />;
        case 'datetime':
          return <ModelDisplayDateTime {...props} />;
        default:
          return <ModelDisplayString {...props} />;
      }
    case 'text':
      return <ModelDisplayText {...props} />;
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
