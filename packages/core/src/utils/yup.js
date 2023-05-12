import * as yup from 'yup';

export const yupTypeFromAttribute = (attribute) => {
  switch (attribute.type) {
    case 'array':
      switch (attribute.items?.type) {
        case 'string':
          return yup.array().of(yup.string());
        case 'integer':
          return yup.array().of(yup.number().integer());
        default:
          return yup.array();
      }
    case 'boolean':
      return yup.boolean();
    case 'decimal':
    case 'float':
      return yup.number();
    case 'integer':
      return yup.number().integer();
    case 'number':
      return yup.number();
    case 'reference':
      return yup.mixed();
    case 'string':
      switch (attribute.format) {
        case 'datetime':
        case 'date':
        case 'time':
          return yup.string();
        case 'email':
          return yup.string().email();
        case 'url':
          return yup.string().url();
        default:
          return yup.string();
      }
    case 'text':
      return yup.string();
    default:
      return null;
  }
};

const transformEmptyString = (value, originalValue) => {
  if (originalValue === '') return null;

  return value;
};

export const yupDefaultFromAttributeType = (attribute) => {
  switch (attribute.type) {
    case 'array':
      return [];
    case 'boolean':
      return false;
    case 'reference':
      return null;
    case 'float':
    case 'integer':
    case 'number':
      return '';
    case 'string':
      // The default value for an enum is null not the empty string
      // because this is how the select component works
      if (attribute.enum) return null;

      switch (attribute.format) {
        case 'datetime':
        case 'date':
        case 'time':
          return null;
        default:
          return '';
      }
    case 'text':
    default:
      return '';
  }
};

const TRANSFORMABLE_TYPES = ['string', 'text', 'float', 'integer', 'number'];

export const yupValidatorsFromAttribute = (attribute) => {
  let ytype = yupTypeFromAttribute(attribute);

  if (!ytype) return;

  ytype = ytype.label(attribute.readableName);

  if (attribute.default) {
    ytype = ytype.default(attribute.default);
  } else {
    ytype = ytype.default(yupDefaultFromAttributeType(attribute));
  }

  // The defaults are an empty string, but we want to set them to null
  // for API and validation purposes
  if (TRANSFORMABLE_TYPES.includes(attribute.type))
    ytype = ytype.transform(transformEmptyString);

  if (attribute['x-rhino-required']) ytype = ytype.required();

  if (attribute.nullable) ytype = ytype.nullable();

  // For arrays
  if (attribute.minItems) ytype.min(attribute.minItems);
  if (attribute.maxItems) ytype.min(attribute.maxItems);

  // For numbers and integers
  if (attribute.minimum) {
    if (attribute.exclusiveMinimum) {
      ytype = ytype.moreThan(attribute.minimum);
    } else {
      ytype = ytype.min(attribute.minimum);
    }
  }
  if (attribute.maximum) {
    if (attribute.exclusiveMaximum) {
      ytype = ytype.lessThan(attribute.maximum);
    } else {
      ytype = ytype.max(attribute.maximum);
    }
  }

  // For strings
  if (attribute.minLength) ytype = ytype.min(attribute.minLength);
  if (attribute.maxLength) ytype = ytype.max(attribute.maxLength);
  if (attribute.pattern) ytype = ytype.matches(new RegExp(attribute.pattern));

  // Enums
  if (attribute.enum) ytype.oneOf(attribute.enum);

  return ytype;
};
