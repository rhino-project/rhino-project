# Rhino Resources

This guide is an introduction to Rhino Resources

---

## What is a Resource?

A Resource is a web resource, manipulated via a REST api. Resources may be created, updated, destroyed or read (CRUD) based on permissions of the system.

### Types of resources

A Resource can be anything that responds the Rhino::Resource interface. Most common is an Active Record based resource. Types of resources include:

#### Rhino::Resource

> The Resource interface to be implemented. Implementations can include it directly and supply a few additional methods or create new module which can then itself be included. See `rhino/rhino/app/resources/rhino/resource_info.rb` for an example.

#### Rhino::Resource::ActiveRecordExtension

> An Active Record resource implementation that exposes all attributes of the model and validatations

#### Rhino::Resource::ActiveStorage

> A further extension of Rhino::Resource::ActiveRecordExtension that is included in ActiveStorage::Attachment

#### Rhino::Resource::ActiveRecordTree

> A further extension of Rhino::Resource::ActiveRecordExtension that includes the ancestry gem and returns API responses in a heirarchal format

### Ownership

With a couple of exceptions, every resource is owned by another resource. For instance a blog post may be owned by a blog. In the case of an Active Record based resource, ownership is usually a belongs_to relationship.

```ruby
class BlogPost < ApplicationRecord
  belongs_to :blog

  rhino_owner :blog
end
```

The resource owner must be explicitly specified for every resource.

There are three special types of owners.

#### Auth Owner

> The resource that controls authentication, by default the provided 'User' Resource.

#### Base Owner

> The Resource that is the top level in the hierarchy of other Resources, by default the provided 'User' Resource, but there cases like rhino_organizations where it may be different from the Auth Owner, for instance a company may own the blogs and users may come and go.

```ruby
class Blog < ApplicationRecord
  belongs_to :company

  rhino_owner_base
end
```

#### Global Owner

> If a Resource is shared across multiple Base and Auth Owners, it is a global resource. Global Resources may have a hierarchy as well.

```ruby
class Category < ApplicationRecord
  rhino_owner_global
end
```

### Properties

Properties are attributes or fields of a Resource. In the case of an Active Record based Resource, these fields are inferred from the model attributes.

#### Restricting properties

Properties on a Resource can be restricted with configuration directives based on type of operation (read, create, update) using the only and except directives

```ruby
class User < ApplicationRecord
  rhino_properties_read only: %i[id uid name email]
  rhino_properties_create only: %i[name nickname email]
  rhino_properties_update only: %i[name nickname]
end
```

```ruby
class User < ApplicationRecord
  rhino_properties_read except: %i[password]
end
```

### References

References of a Resource are links to other related Resources, they are a special type of property and must be explicitly configured to be included in the API response.

```ruby
class BlogPost < ApplicationRecord
  belongs_to :blog

  rhino_owner :blog
  rhino_references [:blog]
end
```

#### References to owner

A reference to the owner of a resource should always be included so that resources can be created.

## Describing resources

All resources must respond to the describe method.

```javascript
"blog": {
  "x-rhino-model": {
    "model": "blog",
    "modelPlural": "blogs",
    "name": "blog",
    "pluralName": "blogs",
    "readableName": "Blog",
    "pluralReadableName": "Blogs",
    "ownedBy": "user",
    "path": "api/blogs"
  },
  "properties": {
    "id": {
      "x-rhino-attribute": {
        "name": "id",
        "readableName": "Id",
        "readable": true,
        "creatable": false,
        "updatable": false
      },
      "nullable": false,
      "type": "identifier"
    },
    "title": {
      "x-rhino-attribute": {
        "name": "title",
        "readableName": "Title",
        "readable": true,
        "creatable": true,
        "updatable": true
      },
      "nullable": false,
      "type": "string"
    },
    "published_at": {
      "x-rhino-attribute": {
        "name": "published_at",
        "readableName": "Published At",
        "readable": true,
        "creatable": true,
        "updatable": true
      },
      "nullable": true,
      "type": "datetime"
    },
    "created_at": {
      "x-rhino-attribute": {
        "name": "created_at",
        "readableName": "Created At",
        "readable": true,
        "creatable": false,
        "updatable": false
      },
      "nullable": false,
      "type": "datetime"
    },
    "updated_at": {
      "x-rhino-attribute": {
        "name": "updated_at",
        "readableName": "Updated At",
        "readable": true,
        "creatable": false,
        "updatable": false
      },
      "nullable": false,
      "type": "datetime"
    },
    "user": {
      "x-rhino-attribute": {
        "name": "user",
        "readableName": "User",
        "readable": true,
        "creatable": true,
        "updatable": true
      },
      "nullable": false,
      "type": "reference",
      "anyOf": [
        {
          "$ref": "#/components/schemas/user"
        }
      ]
    },
    "category": {
      "x-rhino-attribute": {
        "name": "category",
        "readableName": "Category",
        "readable": true,
        "creatable": true,
        "updatable": true
      },
      "nullable": true,
      "type": "reference",
      "anyOf": [
        {
          "$ref": "#/components/schemas/category"
        }
      ]
    },
    "banner_attachment": {
      "x-rhino-attribute": {
        "name": "banner_attachment",
        "readableName": "Banner Attachment",
        "readable": true,
        "creatable": true,
        "updatable": true
      },
      "nullable": true,
      "type": "reference",
      "anyOf": [
        {
          "$ref": "#/components/schemas/active_storage_attachment"
        }
      ]
    },
    "blog_posts": {
      "x-rhino-attribute": {
        "name": "blog_posts",
        "readableName": "Blog Posts",
        "readable": true,
        "creatable": false,
        "updatable": false
      },
      "nullable": true,
      "type": "array",
      "items": {
        "type": "reference",
        "anyOf": [
          {
            "$ref": "#/components/schemas/blog_post"
          }
        ]
      }
    }
  },
  "required": [
    "title",
    "created_at",
    "updated_at",
    "user"
  ]
  }
```

### Attributes (Properties)

This field is called attributes for historical reasons, but is the list of properties available on the resource.

Readable/creatable/nullable

#### Types

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

#### Default values

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

#### Validations

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
