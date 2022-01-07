# frozen_string_literal: true

module Rhino
  class ViewerPolicy < ::Rhino::BasePolicy
    def index?
      authorize_action(true)
    end

    def show?
      authorize_action(true)
    end

    class Scope < ::Rhino::BasePolicy::Scope
      def resolve
        scope.all
      end
    end
  end
end
