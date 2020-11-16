# frozen_string_literal: true

module Rhino
  class Organization < ApplicationRecord
    self.abstract_class = true

    rhino_policy :organization

    def self.roles_for_auth(auth_owner, record = nil)
      return {} unless auth_owner

      # FIXME: - hard code user?
      users_roles = ::UsersRole.where(user: auth_owner).joins(:organization, :role).includes(:organization, :role)
      users_roles = users_roles.where(organization_id: record.base_owner_ids) if record.present? && record.respond_to?(:base_owner_ids)

      # A list of roles as hash keys with an array of base_owners for each
      users_roles.group_by { |ur| ur.role.name }.transform_values { |ur_array| ur_array.map(&:organization) }
    end
  end
end
