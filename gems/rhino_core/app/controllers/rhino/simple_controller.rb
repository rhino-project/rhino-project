# frozen_string_literal: true

module Rhino
  class SimpleController < BaseController
    def action_missing(action)
      authorize klass, "#{action}?".to_sym

      render json: klass.send(action)
    end
  end
end
