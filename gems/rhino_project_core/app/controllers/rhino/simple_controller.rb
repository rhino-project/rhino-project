# frozen_string_literal: true

module Rhino
  class SimpleController < BaseController
    def action_missing(action)
      authorize klass, "#{action}?".to_sym

      method = klass.method(action)

      render json: method.parameters.any? ? klass.send(action, params) : klass.send(action)
    end
  end
end
