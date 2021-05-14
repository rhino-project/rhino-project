# frozen_string_literal: true

module Rhino
  class OrganizationPolicy < ::Rhino::ViewerPolicy
    class Scope < ::Rhino::ViewerPolicy::Scope
      def resolve
        super.joins(scope.joins_for_auth_owner).where("#{Rhino.auth_owner.table_name}.#{Rhino.auth_owner.primary_key}": auth_owner&.id)
      end
    end
  end
end
