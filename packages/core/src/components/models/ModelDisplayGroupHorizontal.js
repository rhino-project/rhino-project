import { ModelDisplayGroupBase } from './ModelDisplayGroup';
import { ModelDisplayGroupHorizontalArray } from './displayGroups/ModelDisplayGroupArray';
import { ModelDisplayGroupHorizontalArrayReference } from './displayGroups/ModelDisplayGroupArrayReference';
import { ModelDisplayGroupHorizontalAttachment } from './displayGroups/ModelDisplayGroupAttachment';
import { ModelDisplayGroupHorizontalAttachmentImage } from './displayGroups/ModelDisplayGroupAttachmentImage';
import { ModelDisplayGroupHorizontalAttachments } from './displayGroups/ModelDisplayGroupAttachments';
import { ModelDisplayGroupHorizontalBoolean } from './displayGroups/ModelDisplayGroupBoolean';
import { ModelDisplayGroupHorizontalCurrency } from './displayGroups/ModelDisplayGroupCurrency';
import { ModelDisplayGroupHorizontalDate } from './displayGroups/ModelDisplayGroupDate';
import { ModelDisplayGroupHorizontalDateTime } from './displayGroups/ModelDisplayGroupDateTime';
import { ModelDisplayGroupHorizontalEnum } from './displayGroups/ModelDisplayGroupEnum';
import { ModelDisplayGroupHorizontalFloat } from './displayGroups/ModelDisplayGroupFloat';
import { ModelDisplayGroupHorizontalInteger } from './displayGroups/ModelDisplayGroupInteger';
import { ModelDisplayGroupHorizontalReference } from './displayGroups/ModelDisplayGroupReference';
import { ModelDisplayGroupHorizontalString } from './displayGroups/ModelDisplayGroupString';
import { ModelDisplayGroupHorizontalText } from './displayGroups/ModelDisplayGroupText';
import { ModelDisplayGroupHorizontalTime } from './displayGroups/ModelDisplayGroupTime';

const defaultComponents = {
  ModelDisplayGroupArray: ModelDisplayGroupHorizontalArray,
  ModelDisplayGroupArrayReference: ModelDisplayGroupHorizontalArrayReference,
  ModelDisplayGroupAttachment: ModelDisplayGroupHorizontalAttachment,
  ModelDisplayGroupAttachmentImage: ModelDisplayGroupHorizontalAttachmentImage,
  ModelDisplayGroupAttachments: ModelDisplayGroupHorizontalAttachments,
  ModelDisplayGroupBoolean: ModelDisplayGroupHorizontalBoolean,
  ModelDisplayGroupCurrency: ModelDisplayGroupHorizontalCurrency,
  ModelDisplayGroupDate: ModelDisplayGroupHorizontalDate,
  ModelDisplayGroupDateTime: ModelDisplayGroupHorizontalDateTime,
  ModelDisplayGroupEnum: ModelDisplayGroupHorizontalEnum,
  ModelDisplayGroupFloat: ModelDisplayGroupHorizontalFloat,
  ModelDisplayGroupInteger: ModelDisplayGroupHorizontalInteger,
  ModelDisplayGroupReference: ModelDisplayGroupHorizontalReference,
  ModelDisplayGroupString: ModelDisplayGroupHorizontalString,
  ModelDisplayGroupText: ModelDisplayGroupHorizontalText,
  ModelDisplayGroupTime: ModelDisplayGroupHorizontalTime
};

export const ModelDisplayGroupHorizontal = (props) => {
  return <ModelDisplayGroupBase overrides={defaultComponents} {...props} />;
};
