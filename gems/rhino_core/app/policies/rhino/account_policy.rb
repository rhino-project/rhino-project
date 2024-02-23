# frozen_string_literal: true

module Rhino
  class AccountPolicy < ::Rhino::BasePolicy
    # Show and update only for this user
    # It should only ever be current user, but this is a safety check

    def show?
      authorize_action(auth_owned?)
    end

    def update?
      authorize_action(auth_owned?)
    end

    class Scope < ::Rhino::BasePolicy::Scope
      def resolve
        scope.where(id: auth_owner&.id)
      end
    end

    private
      def auth_owned?
        record.is_a?(User) && record&.id == auth_owner&.id
      end
  end
end
