# frozen_string_literal: true

module Rhino
  class BaseOwnerContext
    attr_reader :base_owner, :action_name

    def initialize(base_owner, action_name)
      @base_owner = base_owner
      @action_name = action_name
    end
  end
end
