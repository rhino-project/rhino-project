import { useModel } from '../../hooks/models';
import { getModelAndAttributeFromPath } from '../../utils/models';
import ModelCellArray from './cells/ModelCellArray';
import ModelCellArrayReference from './cells/ModelCellArrayReference';
import ModelCellAttachmentDownload from './cells/ModelCellAttachmentDownload';
import ModelCellAttachmentImage from './cells/ModelCellAttachmentImage';
import ModelCellAttachments from './cells/ModelCellAttachments';
import ModelCellBoolean from './cells/ModelCellBoolean';
import ModelCellCountry from './cells/ModelCellCountry';
import ModelCellCurrency from './cells/ModelCellCurrency';
import ModelCellDate from './cells/ModelCellDate';
import ModelCellDateTime from './cells/ModelCellDateTime';
import ModelCellEnum from './cells/ModelCellEnum';
import ModelCellFloat from './cells/ModelCellFloat';
import ModelCellInteger from './cells/ModelCellInteger';
import ModelCellReference from './cells/ModelCellReference';
import ModelCellString from './cells/ModelCellString';
import ModelCellTime from './cells/ModelCellTime';
import { useGlobalComponentForAttribute } from '../../hooks/overrides';
import ModelCellIdentifier from './cells/ModellCellIdentifier';

export const ModelCellBase = (props) => {
  const model = useModel(props.model);
  const { path } = props;

  const [, attribute] = getModelAndAttributeFromPath(model, path);

  // FIXME: Make this a separate function so that its easier to override
  switch (attribute?.type) {
    case 'array':
      switch (attribute.items?.type) {
        case 'string':
        case 'integer':
          return <ModelCellArray {...props} />;
        default:
          if (
            attribute?.items?.anyOf?.[0]?.['$ref'] ===
            '#/components/schemas/active_storage_attachment'
          ) {
            return <ModelCellAttachments {...props} />;
          }
          return <ModelCellArrayReference {...props} />;
      }
    case 'boolean':
      return <ModelCellBoolean {...props} />;
    case 'decimal':
    case 'float':
    case 'number':
      if (attribute.format === 'currency')
        return <ModelCellCurrency {...props} />;

      return <ModelCellFloat {...props} />;

    case 'identifier':
      return <ModelCellIdentifier {...props} />;
    case 'integer':
      return <ModelCellInteger {...props} />;

    case 'reference':
      if (attribute.name.endsWith('_attachment')) {
        if (attribute.format === 'image') {
          return <ModelCellAttachmentImage {...props} />;
        } else {
          return <ModelCellAttachmentDownload {...props} />;
        }
      }
      return <ModelCellReference {...props} />;
    case 'string':
      if (attribute.enum) return <ModelCellEnum {...props} />;

      switch (attribute.format) {
        case 'date':
          return <ModelCellDate {...props} />;
        case 'time':
          return <ModelCellTime {...props} />;
        case 'datetime':
          return <ModelCellDateTime {...props} />;
        case 'country':
          return <ModelCellCountry {...props} />;
        default:
          return <ModelCellString {...props} />;
      }
    default:
      console.assert(false, 'No available cell for ', attribute);
  }

  return 'No cell for this attribute type';
};

const ModelCell = (props) =>
  useGlobalComponentForAttribute('ModelCell', ModelCellBase, props);

export default ModelCell;
