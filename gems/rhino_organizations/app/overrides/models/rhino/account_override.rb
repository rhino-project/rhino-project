# frozen_string_literal: true

class Rhino::Account
  rhino_properties_read only: %i[id name nickname email image users_roles]

  rhino_references [users_roles: %i[organization role]]
end
