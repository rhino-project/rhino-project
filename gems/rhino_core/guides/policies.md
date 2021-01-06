# Rhino Policies

This guide is an introduction to Rhino Policies

## What is a Policy?

Rhino Policies are based on the Pundit gem. Policies can:

- authorize actions ("query methods") such as update? or index?
- constrain resources returned ("scopes")
- enforce strong parameters

## What is a Role?

Every Auth Owner (user) must have at least one role for every base owner they are attached to. In the single user case a user is generally an "admin" which would map to the AdminPolicy.

## Configuring policies and roles

Policies can be configured per resource, the following will look for MyCustomPolicy then Rhino::MyCustomPolicy

```ruby
class Blog < ApplicationRecord
  rhino_policy :my_custom
end
```

Roles can be configured. rhino_organizations for instance does the following to get the roles from the database

```ruby
def self.roles_for_auth(auth_owner, record = nil)
  return {} unless auth_owner&.approved

  { 'admin': [auth_owner] }
end
```

### Built In Policies

Rhino provides a number of builtin policies.

#### Rhino::BasePolicy

> Base for others to inherit from that provides basic initialization and defaults to dis-allowing all actions and scoping to no resources.

#### Rhino::AuthPolicy

> Checks for an authenticated auth owner (user)

#### Rhino::ViewerPolicy

> Allows view actions (index? and show?) actions

#### Rhino::AdminPolicy

> Inherits from ViewerPolicy and allows an authenticated users to view (index? and show?), create (create?), destroy (destroy?) and edit (update?)

#### Rhino::EditorPolicy

> Inherits from ViewerPolicy and allows an authenticated users to view (index? and show?), and edit (update?)

#### Rhino::CrudPolicy

> The default for most Resources, it inherits from BasePolicy. It obtains the roles for the auth owner (user) and then composes the corresponding policies for the user. If any role of a user allows the action. The scopes for the Auth Owner (user) are unioned together.

#### Rhino::GlobalPolicy

> Inherits from ViewerPolicy and allows an authenticated users to view all resources (index? and show?)
