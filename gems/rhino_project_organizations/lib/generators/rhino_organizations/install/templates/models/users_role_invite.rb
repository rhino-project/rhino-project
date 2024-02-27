# frozen_string_literal: true

class UsersRoleInvite < Rhino::UsersRoleInvite
  belongs_to :organization
  belongs_to :role
end
