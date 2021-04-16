# frozen_string_literal: true

module Rhino
  class ActiveStorageUploadPolicy < ::Rhino::AuthPolicy
    def create?
      authorize_action(true)
    end

    class Scope < ::Rhino::AuthPolicy::Scope
    end
  end
end
