# Rhino Resources: Attributes

This guide is an introduction to attributes for Rhino Resources

---

## Attributes (Properties)

This field is called attributes for historical reasons, but is the list of properties available on the resource.

Readable/creatable/nullable

### Types

Types are based on the OpenAPI data types https://swagger.io/docs/specification/data-models/data-types/ and may include format modifiers. These are mapped automatically by the `describe_property` method.

Formats may be overridden for instance a year of birth recorded as an integer `rhino_properties_format dob_year: :year`

In the front end the type/format is mapped as follows:

| Type              |      Format       |                               Component |
| ----------------- | :---------------: | --------------------------------------: |
| identifier        |       none        |                                    none |
| string            |       none        |                                   Input |
| string            |    enum (prop)    |                      ModelFormFieldEnum |
| string            |       date        |                  ModelFormFieldDatetime |
| string            |     datetime      |                  ModelFormFieldDatetime |
| string            |       phone       |                     ModelFormFieldPhone |
| string            |       time        |                  ModelFormFieldDatetime |
| integer           |       none        |                   ModelFormFieldInteger |
| integer           |       year        |                      ModelFormFieldYear |
| text              |       none        |                        Input (textarea) |
| boolean           |       none        |                  CustomInput (checkbox) |
| array (string)    |       none        |                               Typeahead |
| array (reference) |       none        | ModelFormFieldArray/ModelNestedManyForm |
| array (reference) | join_table_simple |                ModelFormFieldJoinSimple |
| reference         |       none        |                 ModelFormFieldReference |
| reference         |       file        |                      ModelFormFieldFile |

#### Phone

Use phonelib for backend validation. It is built based on [Google's libphonenumber](https://github.com/google/libphonenumber) which is the standard for this. Your model might look something like this:

```ruby
  # Set the format for the attribute
  rhino_properties_format phone: :phone

  # Normalize the phone number to e164 format
  before_validation :normalize_phone

  # Validate the phone number is possible (limited check)
  validates :phone, phone: { message: "not a valid phone number", possible: true }

  private
    def normalize_phone
      self.phone = Phonelib.parse(phone).full_e164.presence
    end
```

#### Country

Use the country validator based on [countries gem](https://github.com/countries/countries) for backend validation. Your model might look something like this:

```ruby
  # Validate the optional country
  validates :country, country: { allow_blank: true }
```

```ruby
  # Validate the required alpha3 country
  validates :country, country: { alpha3: true }
```

### Default values

The OpenAPI spec default descriptor is supported. Active Record based resources will automatically translate default values.

```javascript
{
  "name": "published",
  "readableName": "Published",
  "type": "boolean",
  "readable": true,
  "creatable": true,
  "updatable": true,
  "nullable": true,
  "default": false
},
```

### Validations

The OpenAPI spec minimum, maximum, minLength, maxLength and enum constraints are all supported.

Active Record based resources will automatically translate some validations automatically such as:

- ActiveModel::Validations::NumericalityValidator
- ActiveRecord::Validations::LengthValidator
- ActiveModel::Validations::InclusionValidator

```javascript
{
  "name": "hand",
  "readableName": "Hand",
  "type": "string",
  "readable": true,
  "creatable": true,
  "updatable": true,
  "nullable": true,
  "minLength": 1,
  "maxLength": 1,
  "enum": [
    "L",
    "R"
  ]
},
{
  "name": "year",
  "readableName": "Year",
  "type": "integer",
  "readable": true,
  "creatable": true,
  "updatable": true,
  "nullable": true,
  "minimum": 1982,
  "maximum": 2030
},
```
