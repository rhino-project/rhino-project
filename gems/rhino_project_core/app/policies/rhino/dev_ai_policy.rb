# frozen_string_literal: true

module Rhino
  class DevAiPolicy < ::Rhino::BasePolicy
    def show?
      authorize_action(true)
    end

    def create?
      authorize_action(true)
    end
  end
end
