import { ModelFieldGroupBase } from './ModelFieldGroup';
import { ModelFieldGroupHorizontalArrayInteger } from './fieldGroups/ModelFieldGroupArrayInteger';
import { ModelFieldGroupHorizontalArrayString } from './fieldGroups/ModelFieldGroupArrayString';
import { ModelFieldGroupHorizontalBoolean } from './fieldGroups/ModelFieldGroupBoolean';
import { ModelFieldGroupHorizontalCountry } from './fieldGroups/ModelFieldGroupCountry';
import { ModelFieldGroupHorizontalCurrency } from './fieldGroups/ModelFieldGroupCurrency';
import { ModelFieldGroupHorizontalDate } from './fieldGroups/ModelFieldGroupDate';
import { ModelFieldGroupHorizontalDateTime } from './fieldGroups/ModelFieldGroupDateTime';
import { ModelFieldGroupHorizontalEnum } from './fieldGroups/ModelFieldGroupEnum';
import { ModelFieldGroupHorizontalFile } from './fieldGroups/ModelFieldGroupFile';
import { ModelFieldGroupHorizontalFloat } from './fieldGroups/ModelFieldGroupFloat';
import { ModelFieldGroupHorizontalInteger } from './fieldGroups/ModelFieldGroupInteger';
import { ModelFieldGroupHorizontalIntegerSelect } from './fieldGroups/ModelFieldGroupIntegerSelect';
import { ModelFieldGroupHorizontalPhone } from './fieldGroups/ModelFieldGroupPhone';
import { ModelFieldGroupHorizontalString } from './fieldGroups/ModelFieldGroupString';
import { ModelFieldGroupHorizontalText } from './fieldGroups/ModelFieldGroupText';
import { ModelFieldGroupHorizontalTime } from './fieldGroups/ModelFieldGroupTime';
import { ModelFieldGroupHorizontalYear } from './fieldGroups/ModelFieldGroupYear';
import { ModelFieldGroupHorizontalReference } from './fieldGroups/ModelFieldGroupReference';
import { ModelFieldGroupHorizontalOwnerReference } from './fieldGroups/ModelFieldGroupOwnerReference';
import { ModelFieldGroupHorizontalJoinSimple } from './fieldGroups/ModelFieldGroupJoinSimple';

const defaultComponents = {
  // Nested is special and doesn't need to be overridden
  // ModelFieldGroupNested,
  ModelFieldGroupIntegerSelect: ModelFieldGroupHorizontalIntegerSelect,
  ModelFieldGroupArrayInteger: ModelFieldGroupHorizontalArrayInteger,
  ModelFieldGroupArrayString: ModelFieldGroupHorizontalArrayString,
  ModelFieldGroupBoolean: ModelFieldGroupHorizontalBoolean,
  ModelFieldGroupCountry: ModelFieldGroupHorizontalCountry,
  ModelFieldGroupCurrency: ModelFieldGroupHorizontalCurrency,
  ModelFieldGroupDate: ModelFieldGroupHorizontalDate,
  ModelFieldGroupDateTime: ModelFieldGroupHorizontalDateTime,
  ModelFieldGroupEnum: ModelFieldGroupHorizontalEnum,
  ModelFieldGroupFile: ModelFieldGroupHorizontalFile,
  ModelFieldGroupFloat: ModelFieldGroupHorizontalFloat,
  ModelFieldGroupJoinSimple: ModelFieldGroupHorizontalJoinSimple,
  ModelFieldGroupInteger: ModelFieldGroupHorizontalInteger,
  ModelFieldGroupOwnerReference: ModelFieldGroupHorizontalOwnerReference,
  ModelFieldGroupReference: ModelFieldGroupHorizontalReference,
  ModelFieldGroupPhone: ModelFieldGroupHorizontalPhone,
  ModelFieldGroupString: ModelFieldGroupHorizontalString,
  ModelFieldGroupText: ModelFieldGroupHorizontalText,
  ModelFieldGroupTime: ModelFieldGroupHorizontalTime,
  ModelFieldGroupYear: ModelFieldGroupHorizontalYear
};

export const ModelFieldGroupHorizontal = (props) => {
  return <ModelFieldGroupBase overrides={defaultComponents} {...props} />;
};
