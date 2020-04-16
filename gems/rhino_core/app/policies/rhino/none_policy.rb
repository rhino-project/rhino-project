# frozen_string_literal: true

module Rhino
  class NonePolicy
    def initialize(_base_owner, _record)
    end

    def action?
      true
    end
  end
end
