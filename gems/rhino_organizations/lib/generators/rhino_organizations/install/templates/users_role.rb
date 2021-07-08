# frozen_string_literal: true

class UsersRole < Rhino::UsersRole
  belongs_to :user
  belongs_to :organization
  belongs_to :role

  rhino_policy :users_role
  rhino_owner :organization
  rhino_references %i[role organization]
end
