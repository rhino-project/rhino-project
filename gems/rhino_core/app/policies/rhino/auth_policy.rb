# frozen_string_literal: true

module Rhino
  class AuthPolicy
    attr_reader :base_owner_context, :record

    def initialize(base_owner_context, record)
      @base_owner_context = base_owner_context
      @record = record
    end

    def action?
      return false unless base_owner_context.base_owner

      true
    end
  end
end
