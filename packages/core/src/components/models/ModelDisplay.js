import { useModel, useModelAndAttributeFromPath } from 'rhino/hooks/models';
import ModelDisplayString from './displays/ModelDisplayString';
import ModelDisplayDateTime from './displays/ModelDisplayDateTime';
import ModelDisplayText from './displays/ModelDisplayText';
import ModelDisplayBoolean from './displays/ModelDisplayBoolean';
import ModelDisplayFloat from './displays/ModelDisplayFloat';
import ModelDisplayInteger from './displays/ModelDisplayInteger';
import ModelDisplayEnum from './displays/ModelDisplayEnum';
import ModelDisplayTime from './displays/ModelDisplayTime';
import ModelDisplayDate from './displays/ModelDisplayDate';
import ModelDisplayArray from './displays/ModelDisplayArray';
import ModelDisplayAttachments from './displays/ModelDisplayAttachments';
import ModelDisplayArrayReference from './displays/ModelDisplayArrayReference';
import ModelDisplayReference from './displays/ModelDisplayReference';
import ModelDisplayAttachment from './displays/ModelDisplayAttachment';
import ModelDisplayAttachmentImage from './displays/ModelDisplayAttachmentImage';
import { useGlobalComponent } from 'rhino/hooks/overrides';

export const ModelDisplayBase = ({ overrides, ...props }) => {
  const model = useModel(props.model);
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
    case 'identifier':
    case 'integer':
      return <ModelDisplayInteger {...props} />;
    case 'decimal':
    case 'number':
    case 'float':
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
    // eslint-disable-next-line no-fallthrough
    default:
      console.assert(false, 'No available display for ', attribute);
  }

  return 'No display for this attribute type';
};

const ModelDisplay = (props) =>
  useGlobalComponent('ModelDisplay', ModelDisplayBase, props);

export default ModelDisplay;
