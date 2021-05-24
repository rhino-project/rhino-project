# frozen_string_literal: true

module Rhino
  module PolicyHelper
    module_function

    # Looks for the policy associated with a role and resource
    #
    # If a policy for a role and resource is not found, looks for the policy
    # associated with the role.
    #
    # === Examples
    #
    #   find_policy(:author, Blog)
    #
    def find_policy(role, resource, additional_class = nil)
      role = role.to_s if role.is_a? Symbol
      role = role.classify

      resource = resource.klass if resource.respond_to?(:klass)
      resource = resource.to_s.classify

      policy_class = 'Policy'
      policy_class = "#{policy_class}::#{additional_class}" if additional_class

      # Look for role and resource specific policy
      policy_constant = "#{role}#{resource}#{policy_class}".safe_constantize
      return policy_constant if policy_constant.present?

      # Fall back to just the role specific policy
      policy_constant = "#{role}#{policy_class}".safe_constantize
      return policy_constant if policy_constant.present?

      # Fall back just to the rhino version
      "Rhino::#{role}#{policy_class}".safe_constantize
    end

    def find_policy_scope(role, resource)
      find_policy(role, resource, 'Scope')
    end
  end
end
