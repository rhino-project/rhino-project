# frozen_string_literal: true

module Rhino
  module PolicyHelper
    def self.find_policy(base_name, additional_scope = nil)
      base_name = base_name.to_s if base_name.is_a? Symbol
      base_name = base_name.capitalize

      base_scope = 'Policy'
      base_scope += "::#{additional_scope}"

      policy_constant = "#{base_name}#{base_scope}".safe_constantize
      return policy_constant if policy_constant.present?

      "Rhino::#{base_name}#{base_scope}".safe_constantize
    end

    def self.find_policy_scope(base_name)
      find_policy(base_name, 'Scope')
    end
  end
end
