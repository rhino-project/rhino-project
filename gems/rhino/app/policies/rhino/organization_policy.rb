# frozen_string_literal: true

module Rhino
  class OrganizationPolicy < ::Rhino::BasePolicy
    def check_auth
      return false unless auth_owner

      record.id == auth_owner.id
    end

    def index?
      true
    end

    def show?
      true
    end

    def update?
      true
    end

    class Scope < ::Rhino::ViewerPolicy::Scope
      def resolve
        scope.joins(scope.joins_for_auth_owner).where("#{Rhino.auth_owner.table_name}.#{Rhino.auth_owner.primary_key}": auth_owner.id)
      end
    end
  end
end
