import { ModelDisplayGroupBase } from './ModelDisplayGroup';
import { ModelDisplayGroupFloatingArray } from './displayGroups/ModelDisplayGroupArray';
import { ModelDisplayGroupFloatingArrayReference } from './displayGroups/ModelDisplayGroupArrayReference';
import { ModelDisplayGroupFloatingAttachment } from './displayGroups/ModelDisplayGroupAttachment';
import { ModelDisplayGroupFloatingAttachmentImage } from './displayGroups/ModelDisplayGroupAttachmentImage';
import { ModelDisplayGroupFloatingAttachments } from './displayGroups/ModelDisplayGroupAttachments';
import { ModelDisplayGroupFloatingBoolean } from './displayGroups/ModelDisplayGroupBoolean';
import { ModelDisplayGroupFloatingCurrency } from './displayGroups/ModelDisplayGroupCurrency';
import { ModelDisplayGroupFloatingDate } from './displayGroups/ModelDisplayGroupDate';
import { ModelDisplayGroupFloatingDateTime } from './displayGroups/ModelDisplayGroupDateTime';
import { ModelDisplayGroupFloatingEnum } from './displayGroups/ModelDisplayGroupEnum';
import { ModelDisplayGroupFloatingFloat } from './displayGroups/ModelDisplayGroupFloat';
import { ModelDisplayGroupFloatingInteger } from './displayGroups/ModelDisplayGroupInteger';
import { ModelDisplayGroupFloatingReference } from './displayGroups/ModelDisplayGroupReference';
import { ModelDisplayGroupFloatingString } from './displayGroups/ModelDisplayGroupString';
import { ModelDisplayGroupFloatingText } from './displayGroups/ModelDisplayGroupText';
import { ModelDisplayGroupFloatingTime } from './displayGroups/ModelDisplayGroupTime';

const defaultComponents = {
  ModelDisplayGroupArray: ModelDisplayGroupFloatingArray,
  ModelDisplayGroupArrayReference: ModelDisplayGroupFloatingArrayReference,
  ModelDisplayGroupAttachment: ModelDisplayGroupFloatingAttachment,
  ModelDisplayGroupAttachmentImage: ModelDisplayGroupFloatingAttachmentImage,
  ModelDisplayGroupAttachments: ModelDisplayGroupFloatingAttachments,
  ModelDisplayGroupBoolean: ModelDisplayGroupFloatingBoolean,
  ModelDisplayGroupCurrency: ModelDisplayGroupFloatingCurrency,
  ModelDisplayGroupDate: ModelDisplayGroupFloatingDate,
  ModelDisplayGroupDateTime: ModelDisplayGroupFloatingDateTime,
  ModelDisplayGroupEnum: ModelDisplayGroupFloatingEnum,
  ModelDisplayGroupFloat: ModelDisplayGroupFloatingFloat,
  ModelDisplayGroupInteger: ModelDisplayGroupFloatingInteger,
  ModelDisplayGroupReference: ModelDisplayGroupFloatingReference,
  ModelDisplayGroupString: ModelDisplayGroupFloatingString,
  ModelDisplayGroupText: ModelDisplayGroupFloatingText,
  ModelDisplayGroupTime: ModelDisplayGroupFloatingTime
};

export const ModelDisplayGroupFloating = (props) => {
  return <ModelDisplayGroupBase overrides={defaultComponents} {...props} />;
};

export default ModelDisplayGroupFloating;
