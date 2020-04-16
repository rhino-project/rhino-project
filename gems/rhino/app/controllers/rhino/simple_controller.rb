# frozen_string_literal: true

module Rhino
  class SimpleController < BaseController
    def action_missing(action)
      authorize klass, :action?

      render json: klass.send(action)
    end

    def pundit_user
      Rhino::BaseOwnerContext.new(current_user, action_name)
    end
  end
end
