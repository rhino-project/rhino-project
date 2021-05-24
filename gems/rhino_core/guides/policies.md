# Rhino Policies

This guide is an introduction to Rhino Policies

## What is a Policy?

Rhino Policies are based on the Pundit gem. Policies can:

- authorize actions ("query methods") such as update? or index?
- constrain resources returned ("scopes")
- enforce strong parameters

## What is a Role?

Every Auth Owner (user) must have at least one role for every base owner they are attached to. In the single user case a user is generally an "admin" which would map to the AdminPolicy.

Every base owner class must provide a roles_for_auth class method that returns a hash of roles and base owners. For instance the default rhino user class implements the following:

```ruby
def self.roles_for_auth(auth_owner, record = nil)
  return {} unless auth_owner

  # If user is logged in, but no record, they are still an admin for their data
  # Otherwise owner must match to be an admin
  # A list of roles as hash keys with an array of base_owners for each
  return { 'admin': [auth_owner] } if !record.respond_to?(:base_owner_ids) || record.base_owner_ids.include?(auth_owner&.id)

  {}
end
```

Which allows the user to be admin for their own data but have no role for the data of another user. The default Rhino organization class implements the following:

```ruby
def self.roles_for_auth(auth_owner, record = nil)
  return {} unless auth_owner

  users_roles = ::UsersRole.where(user: auth_owner).joins(:organization, :role).includes(:organization, :role)
  users_roles = users_roles.where(organization_id: record.base_owner_ids) if record.present? && record.respond_to?(:base_owner_ids)

  # A list of roles as hash keys with an array of base_owners for each
  users_roles.group_by { |ur| ur.role.name }.transform_values { |ur_array| ur_array.map(&:organization) }
end
```

Which looks up the user role for each organization from the UsersRole table and returns the hash. A user could be an admin for one organization and a viewer for another. An example return value might look something like:

```ruby
{
  admin: [ Organization.find(1), Organization.find(2) ],
  viewer: [ Organization.find(3) ],
  custom_role: [  Organization.find(4) ]
}

```

`roles_for_auth` can be overridden in the application models (`app/models/user.rb` or `app/models/organization.rb`) for customized role behavior.

## Configuring policies and roles

By default every resource that is not globally owned, User or Organization, uses CrudPolicy which handles aggregating policies across roles. Globally owned resources use GlobalPolicy by default. User and Organization have their own special policies.

Based on the role of the user and the resource, CrudPolicy will also apply additional policies. For instance if the role is admin and the resource is Blog, CrudPolicy will first look for admin_blog_policy.rb and then admin_policy.rb if that is not found

```ruby
Rhino::PolicyHelper.find_policy(:admin, Blog)
Rhino::PolicyHelper.find_policy_scope(:author, BlogPost)
```

### When CrudPolicy is not enough

If there are cases where the default CrudPolicy is not enough, any Pundit policy can be set.

```ruby
class Blog < ApplicationRecord
  rhino_policy :my_custom
end
```

However in this case the developer _must_ carefully implement their own user and organization level controls.

## Strong Parameters

Policies enforce incoming and outgoing parameters on models, just as Pundit allows. The BasePolicy (from which all built in policies inherit) will by default use parameters derived from the properties (`rhino_properties_read`, `rhino_properties_create`, `rhino_properties_update`). You can override these however to get customized behavior by role and resource:

```ruby
def permitted_attributes_for_show
  ['only_this_param']
end
```

## Built In Policies

Rhino provides a number of builtin policies that can be used directly or inherited from to provide a starting point.

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

> Inherits from ViewerPolicy and allows an authenticated users to view all resources (index? and show?).

## Testing Policies

Rhino provides Rhino::TestCase::Policy for testing policies.
