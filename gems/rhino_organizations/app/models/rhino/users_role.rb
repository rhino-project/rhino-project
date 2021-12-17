# frozen_string_literal: true

module Rhino
  class UsersRole < ApplicationRecord
    self.abstract_class = true

    rhino_properties_update only: [:role]

    validate :ensure_at_least_one_admin, on: %i[update destroy]

    before_destroy do
      raise ActiveRecord::RecordInvalid, self if invalid?(:destroy)
    end

    private
      def ensure_at_least_one_admin
        admins = organization.users_roles.joins(:role).where({ role: { name: "admin" } })
        user_role_id_being_updated = id
        return unless admins.count == 1 && admins.first.id == user_role_id_being_updated

        errors.add(:role, "Must have at least one user as admin")
      end
  end
end
