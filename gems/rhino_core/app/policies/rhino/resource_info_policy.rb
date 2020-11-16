# frozen_string_literal: true

module Rhino
  class ResourceInfoPolicy < ::Rhino::BasePolicy
    def index?
      authorize_action(true)
    end
  end
end
