# Rhino API

This guide is an introduction to Rhino API

---

## Rhino REST API

The Rhino REST API is based on OpenAPI (Swagger), but is not fully compliant.

A description of the API is available at /api/info/models, for instance:
http://localhost:3002/api/info/models

This is the output the description of all resources.

### Routing and Controllers

By default Resources will have the standard CRUD based routing (ie resource: :blogs from rails). Routes can be altered with rhino configuration directives.

```ruby
class Blog < ApplicationRecord
  rhino_routing only: [:index]
end
```

```ruby
class Blog < ApplicationRecord
  rhino_routing except: [:destroy], path: 'my_custom_blog_endpoint'
end
```

Globally owned resources will only have index and show available by default

The default controller for Resources in Rhino::CrudController, but this can be altered

```ruby
class Blog < ApplicationRecord
  rhino_controller :simple
end
```

#### Built In Controllers

#### Rhino::BaseController

> Base for others to inherit from that provides basic initialization, error handling, pundit and cors

#### Rhino::CrudController

> Provides basic CRUD actions (index, show, create, update, destroy) and enforces policy authorization, scoping and parameratization as well as sieve support

#### Rhino::SimpleController

> Maps an action to a method on the Resource itself. Enforces policy authorization but nothing else.

#### API Name Spacing

By default all API routes are available under '/api', but this can be configured with a setting in the initializer

```ruby
Rhino.setup do |config|
  config.namespace = 'my_custom_api'
end
```

### Parameters

Parameters are what is accepted or returned from the API as properties for the Resource. Parameters by default reflect the properties of a resource, but can be overwritten by the resource itself or policies.

#### Reference parameters

Importantly references are returned as an embedded object of a resource, directly in the case of a one relationship and in an array in the case of a many relationship. For instance:

```javascript
// BlogPost
{
  id: 323,
  title: "My post",
  blog: {
    id: 6,
    name: "Super Blog"
  }
}
```

However when setting a reference parameter, use the identifier property (ie the foreign key) as the parameter.

```javascript
// BlogPost
{
  id: 323,
  title: "My post",
  blog: 7
}
```

#### Nested support

Resources with many references resources can accepted "nested" . With active record based resources this is handled automatically if accepts_nested_attributes_for is configureated on the model.

#### Properties vs Parameters

Properties are part of the data model of the Resource, while parameters are what the REST API will accept and return for a Resource. They can be different.

### Filtering with Sieves

Filtering resources on index API endpoints is accomplished through Sieves. Sieves are an ordered stack of filter actions applied based on query parameters. They act very much like the rails middleware stack.

There is a default set of sieves, but they can be altered on a per resource basis. For instance this would remove the

```ruby
class Blog < ApplicationRecord
  rhino_sieves.swap Rhino::Sieve::Limit, Rhino::Sieve::Limit, default_limit: nil
end
```

#### Rhino::Sieve::Filter

> Filter based on properties, including properties of referenced resources [read more](./rest_api_filtering.md).

#### Rhino::Sieve::Limit

> Limit the number of resources returned.
> http://localhost:3002/api/blogs?limit=10

#### Rhino::Sieve::Offset

> Offset from start of the results. Used for pagination.
> http://localhost:3002/api/blogs?limit=10&offset=10

#### Rhino::Sieve::Order

> Sorting of the results - leading underscore denotes descending order ('\_')
> http://localhost:3002/api/blogs?order=title http://localhost:3002/api/blogs?order=title

#### Rhino::Sieve::Search

> Full text contains searching
> http://localhost:3002/api/blog_posts?title=heart
