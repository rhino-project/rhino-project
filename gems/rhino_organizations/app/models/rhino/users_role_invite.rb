# frozen_string_literal: true

module Rhino
  class UsersRoleInvite < ApplicationRecord
    self.abstract_class = true

    rhino_policy :users_role
    rhino_owner :organization
    rhino_references %i[role organization]

    rhino_controller :users_role_invite

    after_create do
      ::UsersRole.create!(user: ::User.find_by(email: email), organization: organization, role: role)
    end
  end
end
