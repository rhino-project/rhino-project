# frozen_string_literal: true

module Rhino
  class UserPolicy < ::Rhino::ViewerPolicy
    class Scope < ::Rhino::ViewerPolicy::Scope
      # We allow other users in the org to view the user
      def resolve
        return scope.none unless auth_owner

        base_owner_pk = "#{Rhino.base_owner.table_name}.#{Rhino.base_owner.primary_key}"

        # Base owners for the user
        base_owners = scope.joins(scope.joins_for_base_owner).where(id: auth_owner.id).pluck(base_owner_pk)

        # Users related to the base owners
        scope.joins(scope.joins_for_base_owner).where(base_owner_pk => base_owners).distinct
      end
    end
  end
end
