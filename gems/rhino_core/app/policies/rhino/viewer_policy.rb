# frozen_string_literal: true

module Rhino
  class ViewerPolicy < ::Rhino::AuthPolicy
    def index?
      authorize_action(true)
    end

    def show?
      authorize_action(true)
    end

    class Scope < ::Rhino::AuthPolicy::Scope
      def resolve
        super.all
      end
    end
  end
end
