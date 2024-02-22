# frozen_string_literal: true

module Rhino
  class EditorPolicy < ::Rhino::ViewerPolicy
    def update?
      authorize_action(true)
    end

    class Scope < ::Rhino::ViewerPolicy::Scope
    end
  end
end
