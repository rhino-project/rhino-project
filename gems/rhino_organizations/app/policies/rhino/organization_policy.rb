# frozen_string_literal: true

module Rhino
  class OrganizationPolicy < ::Rhino::ViewerPolicy
    def update?
      # Must be an admin to update
      is_admin = Rhino.base_owner.roles_for_auth(auth_owner).any? { |k, v| k == "admin" && v.include?(record) }
      authorize_action(is_admin)
    end

    class Scope < ::Rhino::ViewerPolicy::Scope
      def resolve
        super.joins(scope.joins_for_auth_owner).where("#{Rhino.auth_owner.table_name}.#{Rhino.auth_owner.primary_key}": auth_owner&.id)
      end
    end
  end
end
