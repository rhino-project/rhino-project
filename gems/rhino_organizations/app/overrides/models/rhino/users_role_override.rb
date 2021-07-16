# frozen_string_literal: true

class Rhino::UsersRole
  rhino_policy :users_role
  rhino_owner :organization
  rhino_references %i[role organization]
end
