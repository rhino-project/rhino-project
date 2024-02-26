# frozen_string_literal: true

module Rhino
  class SimpleStreamController < BaseController
    def action_missing(action)
      authorize klass, "#{action}?".to_sym

      info = klass.send(action)
      send_file(info[:file], info.except(:file)) if info.key?(:file)
    end
  end
end
