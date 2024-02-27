# frozen_string_literal: true

module Rhino
  class ActiveStorageAttachmentPolicy < ::Rhino::BasePolicy
    def create?
      authorize_action(true)
    end

    def show?
      authorize_action(true)
    end

    class Scope < ::Rhino::BasePolicy::Scope
    end
  end
end
