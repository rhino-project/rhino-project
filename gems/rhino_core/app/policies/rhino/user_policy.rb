# frozen_string_literal: true

module Rhino
  class UserPolicy < ::Rhino::BasePolicy
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
        super.where(id: auth_owner&.id)
      end
    end
  end
end
