# frozen_string_literal: true

module Rhino
  class Current < ActiveSupport::CurrentAttributes
    attribute :user
  end
end
