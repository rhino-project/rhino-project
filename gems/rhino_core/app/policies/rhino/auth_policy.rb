# frozen_string_literal: true

module Rhino
  class AuthPolicy < ::Rhino::BasePolicy
    set_callback :authorize_action, :before, :check_auth

    def check_auth
      auth_owner.present?
    end

    class Scope < ::Rhino::BasePolicy::Scope
      def resolve
        return scope.none unless auth_owner.present?

        scope
      end
    end
  end
end
