# frozen_string_literal: true

module Rhino
  class AdminPolicy < ::Rhino::ViewerPolicy
    def create?
      authorize_action(true)
    end

    def update?
      authorize_action(true)
    end

    def destroy?
      authorize_action(true)
    end

    class Scope < ::Rhino::ViewerPolicy::Scope
    end
  end
end
