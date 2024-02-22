import { ModelFieldGroupBase } from './ModelFieldGroup';
import { ModelFieldGroupFloatingArrayInteger } from './fieldGroups/ModelFieldGroupArrayInteger';
import { ModelFieldGroupFloatingArrayString } from './fieldGroups/ModelFieldGroupArrayString';
import { ModelFieldGroupFloatingBoolean } from './fieldGroups/ModelFieldGroupBoolean';
import { ModelFieldGroupFloatingCountry } from './fieldGroups/ModelFieldGroupCountry';
import { ModelFieldGroupFloatingCurrency } from './fieldGroups/ModelFieldGroupCurrency';
import { ModelFieldGroupFloatingDate } from './fieldGroups/ModelFieldGroupDate';
import { ModelFieldGroupFloatingDateTime } from './fieldGroups/ModelFieldGroupDateTime';
import { ModelFieldGroupFloatingEnum } from './fieldGroups/ModelFieldGroupEnum';
import { ModelFieldGroupFloatingFile } from './fieldGroups/ModelFieldGroupFile';
import { ModelFieldGroupFloatingFloat } from './fieldGroups/ModelFieldGroupFloat';
import { ModelFieldGroupFloatingInteger } from './fieldGroups/ModelFieldGroupInteger';
import { ModelFieldGroupFloatingIntegerSelect } from './fieldGroups/ModelFieldGroupIntegerSelect';
import { ModelFieldGroupFloatingJoinSimple } from './fieldGroups/ModelFieldGroupJoinSimple';
import { ModelFieldGroupFloatingOwnerReference } from './fieldGroups/ModelFieldGroupOwnerReference';
import { ModelFieldGroupFloatingPhone } from './fieldGroups/ModelFieldGroupPhone';
import { ModelFieldGroupFloatingReference } from './fieldGroups/ModelFieldGroupReference';
import { ModelFieldGroupFloatingString } from './fieldGroups/ModelFieldGroupString';
import { ModelFieldGroupFloatingText } from './fieldGroups/ModelFieldGroupText';
import { ModelFieldGroupFloatingTime } from './fieldGroups/ModelFieldGroupTime';
import { ModelFieldGroupFloatingYear } from './fieldGroups/ModelFieldGroupYear';

const defaultComponents = {
  // Nested is special and doesn't need to be overridden
  // ModelFieldGroupNested,
  ModelFieldGroupIntegerSelect: ModelFieldGroupFloatingIntegerSelect,
  ModelFieldGroupArrayInteger: ModelFieldGroupFloatingArrayInteger,
  ModelFieldGroupArrayString: ModelFieldGroupFloatingArrayString,
  ModelFieldGroupBoolean: ModelFieldGroupFloatingBoolean,
  ModelFieldGroupCountry: ModelFieldGroupFloatingCountry,
  ModelFieldGroupCurrency: ModelFieldGroupFloatingCurrency,
  ModelFieldGroupDate: ModelFieldGroupFloatingDate,
  ModelFieldGroupDateTime: ModelFieldGroupFloatingDateTime,
  ModelFieldGroupEnum: ModelFieldGroupFloatingEnum,
  ModelFieldGroupFile: ModelFieldGroupFloatingFile,
  ModelFieldGroupFloat: ModelFieldGroupFloatingFloat,
  ModelFieldGroupJoinSimple: ModelFieldGroupFloatingJoinSimple,
  ModelFieldGroupInteger: ModelFieldGroupFloatingInteger,
  ModelFieldGroupOwnerReference: ModelFieldGroupFloatingOwnerReference,
  ModelFieldGroupReference: ModelFieldGroupFloatingReference,
  ModelFieldGroupPhone: ModelFieldGroupFloatingPhone,
  ModelFieldGroupString: ModelFieldGroupFloatingString,
  ModelFieldGroupText: ModelFieldGroupFloatingText,
  ModelFieldGroupTime: ModelFieldGroupFloatingTime,
  ModelFieldGroupYear: ModelFieldGroupFloatingYear
};

export const ModelFieldGroupFloating = (props) => {
  return <ModelFieldGroupBase overrides={defaultComponents} {...props} />;
};
