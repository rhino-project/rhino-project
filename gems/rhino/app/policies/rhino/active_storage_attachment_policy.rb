# frozen_string_literal: true

module Rhino
  class ActiveStorageAttachmentPolicy < ::Rhino::AuthPolicy
    def create?
      authorize_action(true)
    end

    def show?
      authorize_action(true)
    end

    class Scope < ::Rhino::AuthPolicy::Scope
    end
  end
end
