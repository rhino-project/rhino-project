# frozen_string_literal: true

module Rhino
  class UsersRolePolicy < ::Rhino::ViewerPolicy
    def show?
      authorize_action(true) if admin? || record.user == auth_owner
    end

    def create?
      authorize_action admin?
    end

    def update?
      authorize_action admin?
    end

    def destroy?
      authorize_action admin?
    end

    private
      def admin?
        Rhino.base_owner.roles_for_auth(auth_owner).any? { |k, v| k == "admin" && v.include?(record.organization) }
      end

      class Scope < ::Rhino::ViewerPolicy::Scope
        def resolve
          admin_organizations = ::Organization.joins(users_roles: [:role]).where(users_roles: { roles: { name: "admin" }, user: auth_owner })
          scope.where(organization: admin_organizations).or(scope.where(user: auth_owner))
        end
      end
  end
end
